import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import { ShopsService } from './shops.service'
import { CreateShopDto } from './dto/create-shop.dto'
import { JwtAccessGuard } from '@/auth/guards/jwt-access.guard'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { JwtPayload } from '@/common/types/jwt-payload.type'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

@Controller('shops')
@UseGuards(JwtAccessGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  /** POST /shops — Register a new shop for the authenticated owner */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Toko berhasil didaftarkan')
  createShop(@CurrentUser() user: JwtPayload, @Body() dto: CreateShopDto) {
    return this.shopsService.createShop(user.sub, dto)
  }
}
