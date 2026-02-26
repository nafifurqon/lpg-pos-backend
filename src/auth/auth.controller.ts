import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterEmailDto } from './dto/register-email.dto'
import { LoginEmailDto } from './dto/login-email.dto'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { JwtAccessGuard } from './guards/jwt-access.guard'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtAccessPayload, JwtRefreshPayload } from '@/common/types/jwt-payload.type'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register — Email + password registration */
  @Post('register')
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.registerWithEmail(dto)
  }

  /** POST /auth/login — Email + password login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() dto: LoginEmailDto) {
    return this.authService.loginWithEmail(dto)
  }

  /** POST /auth/google — Exchange Google auth-code for token pair */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto.code)
  }

  /** POST /auth/refresh — Use refresh token to get a new token pair */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  refresh(@CurrentUser() user: JwtRefreshPayload & { rawToken: string }) {
    return this.authService.refreshTokens(user.sub, user.authId, user.rawToken)
  }

  /** POST /auth/logout — Invalidate the current refresh token session */
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtRefreshGuard)
  async logout(@CurrentUser() user: JwtRefreshPayload) {
    await this.authService.logout(user.authId)
  }
}
