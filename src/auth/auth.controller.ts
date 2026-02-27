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
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtPayload } from '@/common/types/jwt-payload.type'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register — Email + password registration */
  @Post('register')
  @ResponseMessage('Berhasil mendaftar')
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.registerWithEmail(dto)
  }

  /** POST /auth/login — Email + password login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Berhasil masuk')
  login(@Body() dto: LoginEmailDto) {
    return this.authService.loginWithEmail(dto)
  }

  /** POST /auth/google — Exchange Google auth-code for token pair */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Berhasil masuk dengan Google')
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto.code)
  }

  /** POST /auth/refresh — Use refresh token to get a new token pair */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ResponseMessage('Token berhasil diperbarui')
  refresh(@CurrentUser() user: JwtPayload & { rawRefreshToken: string }) {
    return this.authService.refreshTokens(user.sub, user.email, user.role, user.rawRefreshToken)
  }

  /** POST /auth/logout — Invalidate the current refresh token session */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ResponseMessage('Berhasil keluar')
  async logout(@CurrentUser() user: JwtPayload) {
    await this.authService.logout(user.sub)
  }
}
