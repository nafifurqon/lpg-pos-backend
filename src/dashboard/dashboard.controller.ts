import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { JwtAccessGuard } from '@/auth/guards/jwt-access.guard'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { JwtPayload } from '@/common/types/jwt-payload.type'

@ApiTags('Dashboard')
@ApiBearerAuth('bearer')
@Controller('dashboard')
@UseGuards(JwtAccessGuard)
export class DashboardController {
  /** GET /dashboard — Returns the authenticated user's basic info. */
  @Get()
  @ApiOperation({ summary: 'Ambil informasi dasar user yang sedang login' })
  @ApiResponse({
    status: 200,
    description: 'Data user berhasil diambil.',
    schema: {
      example: { user_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', email: 'user@example.com', role: 'owner' },
    },
  })
  @ApiResponse({ status: 401, description: 'Access token tidak valid atau tidak ada' })
  getOverview(@CurrentUser() user: JwtPayload) {
    return { user_id: user.sub, email: user.email, role: user.role }
  }
}
