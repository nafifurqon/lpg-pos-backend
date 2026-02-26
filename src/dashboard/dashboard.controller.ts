import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAccessGuard } from '@/auth/guards/jwt-access.guard'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { JwtAccessPayload } from '@/common/types/jwt-payload.type'

@Controller('dashboard')
@UseGuards(JwtAccessGuard)
export class DashboardController {
  /** GET /dashboard — Returns the authenticated user's basic info. */
  @Get()
  getOverview(@CurrentUser() user: JwtAccessPayload) {
    return { userId: user.sub, email: user.email }
  }
}
