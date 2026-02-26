import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtAccessPayload } from '@/common/types/jwt-payload.type'

/**
 * Extracts the authenticated user from the request object.
 *
 * Usage:
 *   @Get('me')
 *   @UseGuards(JwtAccessGuard)
 *   getMe(@CurrentUser() user: JwtAccessPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtAccessPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as JwtAccessPayload
  },
)
