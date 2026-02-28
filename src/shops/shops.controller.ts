import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ShopsService } from './shops.service'
import { CreateShopDto } from './dto/create-shop.dto'
import { Shop } from './entities/shop.entity'
import { JwtAccessGuard } from '@/auth/guards/jwt-access.guard'
import { CurrentUser } from '@/auth/decorators/current-user.decorator'
import { JwtPayload } from '@/common/types/jwt-payload.type'
import { ResponseMessage } from '@/common/decorators/response-message.decorator'

@ApiTags('Shops')
@ApiBearerAuth('bearer')
@Controller('shops')
@UseGuards(JwtAccessGuard)
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  /** POST /shops — Register a new shop for the authenticated owner */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Toko berhasil didaftarkan')
  @ApiOperation({ summary: 'Daftarkan toko baru untuk owner yang sedang login' })
  @ApiBody({ type: CreateShopDto })
  @ApiResponse({ status: 201, description: 'Toko berhasil didaftarkan.', type: Shop })
  @ApiResponse({ status: 400, description: 'Validasi gagal' })
  @ApiResponse({ status: 401, description: 'Access token tidak valid atau tidak ada' })
  @ApiResponse({ status: 409, description: 'Owner sudah memiliki toko' })
  createShop(@CurrentUser() user: JwtPayload, @Body() dto: CreateShopDto) {
    return this.shopsService.createShop(user.sub, dto)
  }

  /** GET /shops/mine — Return the authenticated owner's shop, or null if none */
  @Get('mine')
  @ResponseMessage('Berhasil mengambil data toko')
  @ApiOperation({ summary: 'Ambil data toko milik owner yang sedang login' })
  @ApiResponse({ status: 200, description: 'Data toko berhasil diambil. Null jika belum memiliki toko.', type: Shop })
  @ApiResponse({ status: 401, description: 'Access token tidak valid atau tidak ada' })
  getMyShop(@CurrentUser() user: JwtPayload) {
    return this.shopsService.findByOwnerId(user.sub)
  }
}
