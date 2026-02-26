import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtPayload } from '@/common/types/jwt-payload.type'

/**
 * Extracts the authenticated user from the request object.
 *
 * Usage:
 *   @Get('me')
 *   @UseGuards(JwtAccessGuard)
 *   getMe(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user as JwtPayload
  },
)
