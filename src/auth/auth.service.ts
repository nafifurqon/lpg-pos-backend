import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { OAuth2Client } from 'google-auth-library'

import { UsersService } from '@/users/users.service'
import { AuthenticationsService } from '@/authentications/authentications.service'
import { UserRole } from '@/users/entities/user.entity'
import { RegisterEmailDto } from './dto/register-email.dto'
import { LoginEmailDto } from './dto/login-email.dto'
import { JwtPayload } from '@/common/types/jwt-payload.type'

export type TokenPair = { access_token: string; refresh_token: string }

@Injectable()
export class AuthService {
  private readonly googleClient: OAuth2Client

  constructor(
    private readonly usersService: UsersService,
    private readonly authenticationsService: AuthenticationsService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      config.getOrThrow('GOOGLE_CLIENT_ID'),
      config.getOrThrow('GOOGLE_CLIENT_SECRET'),
      'postmessage', // redirect_uri for auth-code flow from browser
    )
  }

  // ─────────────────────────── Email register ────────────────────────────────

  async registerWithEmail(dto: RegisterEmailDto): Promise<TokenPair> {

    const existing = await this.usersService.findByEmail(dto.email)
    if (existing) throw new ConflictException('Email sudah terdaftar')

    const passwordHash = await bcrypt.hash(dto.password, 12)
    const user = await this.usersService.createEmailUser(dto.email, passwordHash)

    return this.issueTokenPair(user.id, user.email, user.role)
  }

  // ─────────────────────────── Email login ───────────────────────────────────

  async loginWithEmail(dto: LoginEmailDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Email atau password salah')

    return this.issueTokenPair(user.id, user.email, user.role)
  }

  // ─────────────────────────── Google OAuth ──────────────────────────────────

  async loginWithGoogle(code: string): Promise<TokenPair> {
    const { tokens } = await this.googleClient.getToken(code).catch(() => {
      throw new UnauthorizedException('Kode Google tidak valid')
    })

    const ticket = await this.googleClient
      .verifyIdToken({ idToken: tokens.id_token!, audience: this.config.getOrThrow('GOOGLE_CLIENT_ID') })
      .catch(() => {
        throw new UnauthorizedException('Token Google tidak valid')
      })

    const payload = ticket.getPayload()
    if (!payload?.email) throw new InternalServerErrorException('Gagal mendapatkan email dari Google')

    const { email, sub: googleId } = payload

    // Find by googleId first, then by email (for linking existing email accounts)
    let user =
      (await this.usersService.findByGoogleId(googleId)) ??
      (await this.usersService.findByEmail(email))

    if (!user) {
      user = await this.usersService.createGoogleUser(email, googleId)
    }

    return this.issueTokenPair(user.id, user.email, user.role)
  }

  // ─────────────────────────── Refresh token ─────────────────────────────────

  async refreshTokens(
    userId: string,
    email: string,
    role: UserRole,
    rawRefreshToken: string,
  ): Promise<TokenPair> {
    const session = await this.authenticationsService.validateRefreshToken(userId, rawRefreshToken)
    if (!session) throw new UnauthorizedException('Sesi tidak valid')

    // Rotate: update hash in-place before issuing new tokens
    const newRefreshToken = this.signToken(
      { sub: userId, email, role },
      this.config.getOrThrow('JWT_REFRESH_SECRET'),
      this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    )
    await this.authenticationsService.updateSessionToken(userId, newRefreshToken)

    const access_token = this.signToken(
      { sub: userId, email, role },
      this.config.getOrThrow('JWT_ACCESS_SECRET'),
      this.config.get('JWT_ACCESS_EXPIRES_IN', '10m'),
    )

    return { access_token, refresh_token: newRefreshToken }
  }

  // ─────────────────────────── Logout ────────────────────────────────────────

  async logout(userId: string): Promise<void> {
    await this.authenticationsService.clearSession(userId)
  }

  // ─────────────────────────── Helpers ───────────────────────────────────────

  /**
   * Issues an access + refresh token pair using the same JwtPayload shape
   * and persists the hashed refresh token via upsert (single-device).
   */
  private async issueTokenPair(userId: string, email: string, role: UserRole): Promise<TokenPair> {
    const payload: JwtPayload = { sub: userId, email, role }

    const access_token = this.signToken(
      payload,
      this.config.getOrThrow('JWT_ACCESS_SECRET'),
      this.config.get('JWT_ACCESS_EXPIRES_IN', '10m'),
    )

    const refresh_token = this.signToken(
      payload,
      this.config.getOrThrow('JWT_REFRESH_SECRET'),
      this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    )

    // Upsert: creates a session or overwrites the existing one (single-device)
    await this.authenticationsService.replaceSession(userId, refresh_token)

    return { access_token, refresh_token }
  }

  private signToken(payload: JwtPayload, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, { secret, expiresIn })
  }
}
