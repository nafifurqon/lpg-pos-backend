import { Injectable, ConflictException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Shop } from './entities/shop.entity'
import { CreateShopDto } from './dto/create-shop.dto'

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopsRepo: Repository<Shop>,
  ) {}

  async createShop(ownerId: string, dto: CreateShopDto): Promise<Shop> {
    const existing = await this.shopsRepo.findOneBy({ ownerId })
    if (existing) throw new ConflictException('Toko sudah terdaftar')

    const shop = this.shopsRepo.create({
      name: dto.name,
      address: dto.address,
      registrationNumber: dto.registrationNumber ?? null,
      ownerId,
    })

    return this.shopsRepo.save(shop)
  }

  findByOwnerId(ownerId: string): Promise<Shop | null> {
    return this.shopsRepo.findOneBy({ ownerId })
  }
}
