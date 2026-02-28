import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { RegisterEmailDto } from './dto/register-email.dto'
import { LoginEmailDto } from './dto/login-email.dto'
import { GoogleAuthDto } from './dto/google-auth.dto'
import { AuthResponseDto } from './dto/auth-response.dto'
import { JwtRefreshGuard } from './guards/jwt-refresh.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import { JwtPayload } from '@/common/types/jwt-payload.type'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** POST /auth/register — Email + password registration */
  @Post('register')
  @ResponseMessage('Berhasil mendaftar')
  @ApiOperation({ summary: 'Registrasi dengan email dan password' })
  @ApiBody({ type: RegisterEmailDto })
  @ApiResponse({ status: 201, description: 'Registrasi berhasil. Mengembalikan token pair dan data user.', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Validasi gagal (email tidak valid, password terlalu lemah, dsb.)' })
  @ApiResponse({ status: 409, description: 'Email sudah terdaftar' })
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.registerWithEmail(dto)
  }

  /** POST /auth/login — Email + password login */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Berhasil masuk')
  @ApiOperation({ summary: 'Login dengan email dan password' })
  @ApiBody({ type: LoginEmailDto })
  @ApiResponse({ status: 200, description: 'Login berhasil. Mengembalikan token pair dan data user.', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  login(@Body() dto: LoginEmailDto) {
    return this.authService.loginWithEmail(dto)
  }

  /** POST /auth/google — Exchange Google auth-code for token pair */
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Berhasil masuk dengan Google')
  @ApiOperation({ summary: 'Login / registrasi dengan Google OAuth (auth-code flow)' })
  @ApiBody({ type: GoogleAuthDto })
  @ApiResponse({ status: 200, description: 'Login Google berhasil. Mengembalikan token pair dan data user.', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Authorization code tidak valid atau sudah kadaluarsa' })
  googleLogin(@Body() dto: GoogleAuthDto) {
    return this.authService.loginWithGoogle(dto.code)
  }

  /** POST /auth/refresh — Use refresh token to get a new token pair */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ResponseMessage('Token berhasil diperbarui')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Perbarui token pair menggunakan refresh token' })
  @ApiResponse({ status: 200, description: 'Token berhasil diperbarui. Mengembalikan token pair baru.', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid atau sudah kadaluarsa' })
  refresh(@CurrentUser() user: JwtPayload & { rawRefreshToken: string }) {
    return this.authService.refreshTokens(user.sub, user.email, user.role, user.rawRefreshToken)
  }

  /** POST /auth/logout — Invalidate the current refresh token session */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ResponseMessage('Berhasil keluar')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Logout — hapus sesi refresh token aktif' })
  @ApiResponse({ status: 200, description: 'Logout berhasil. Sesi refresh token dihapus.' })
  @ApiResponse({ status: 401, description: 'Refresh token tidak valid atau sudah kadaluarsa' })
  async logout(@CurrentUser() user: JwtPayload) {
    await this.authService.logout(user.sub)
  }
}
