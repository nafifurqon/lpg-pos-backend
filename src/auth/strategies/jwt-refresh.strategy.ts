import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'
import { JwtPayload } from '@/common/types/jwt-payload.type'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    })
  }

  /**
   * Passport calls validate() after the signature + expiry checks pass.
   * We attach the raw refresh token so AuthService can verify the stored hash.
   */
  validate(req: Request, payload: JwtPayload): JwtPayload & { rawRefreshToken: string } {
    const authHeader = req.headers['authorization'] ?? ''
    const rawRefreshToken = authHeader.replace('Bearer ', '').trim()
    return { ...payload, rawRefreshToken }
  }
}
