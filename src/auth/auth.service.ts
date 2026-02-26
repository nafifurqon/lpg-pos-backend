import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'

import { UsersService } from '@/users/users.service'
import { AuthenticationsService } from '@/authentications/authentications.service'
import { AuthProvider } from '@/users/entities/user.entity'
import { RegisterEmailDto } from './dto/register-email.dto'
import { LoginEmailDto } from './dto/login-email.dto'
import { JwtAccessPayload, JwtRefreshPayload } from '@/common/types/jwt-payload.type'

export type TokenPair = { accessToken: string; refreshToken: string }

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

    return this.createTokenPair(user.id, user.email)
  }

  // ─────────────────────────── Email login ───────────────────────────────────

  async loginWithEmail(dto: LoginEmailDto): Promise<TokenPair> {
    const user = await this.usersService.findByEmail(dto.email)
    if (!user || user.provider !== AuthProvider.EMAIL || !user.passwordHash) {
      throw new UnauthorizedException('Email atau password salah')
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if (!valid) throw new UnauthorizedException('Email atau password salah')

    return this.createTokenPair(user.id, user.email)
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

    return this.createTokenPair(user.id, user.email)
  }

  // ─────────────────────────── Refresh token ─────────────────────────────────

  async refreshTokens(userId: string, authId: string, rawRefreshToken: string): Promise<TokenPair> {
    const session = await this.authenticationsService.validateRefreshToken(authId, rawRefreshToken)
    if (!session || session.userId !== userId) {
      throw new UnauthorizedException('Sesi tidak valid')
    }

    const user = await this.usersService.findById(userId)
    if (!user) throw new UnauthorizedException('User tidak ditemukan')

    // Rotate: delete old session before issuing new tokens
    await this.authenticationsService.deleteSession(authId)

    return this.createTokenPair(user.id, user.email)
  }

  // ─────────────────────────── Logout ────────────────────────────────────────

  async logout(authId: string): Promise<void> {
    await this.authenticationsService.deleteSession(authId)
  }

  // ─────────────────────────── Helpers ───────────────────────────────────────

  /**
   * Issues an access + refresh token pair and persists the refresh token hash.
   *
   * Strategy: generate a UUID for the session upfront so we can embed it in
   * the refresh token payload *before* writing to the DB. This avoids multiple
   * round-trips.
   */
  private async createTokenPair(userId: string, email: string): Promise<TokenPair> {
    // 1. Access token — short-lived, no DB interaction
    const accessPayload: JwtAccessPayload = { sub: userId, email }
    const accessToken = this.jwtService.sign(accessPayload, {
      secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get('JWT_ACCESS_EXPIRES_IN', '10m'),
    })

    // 2. Pre-generate a session ID so we can embed it in the refresh payload
    const sessionId = crypto.randomUUID()

    const refreshPayload: JwtRefreshPayload = { sub: userId, authId: sessionId }
    const refreshToken = this.jwtService.sign(refreshPayload, {
      secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    })

    // 3. Persist the hashed refresh token with the pre-generated ID
    await this.authenticationsService.createSessionWithId(sessionId, userId, refreshToken)

    return { accessToken, refreshToken }
  }
}
