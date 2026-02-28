import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateShopDto {
  @ApiProperty({ example: 'Toko Sumber Gas', description: 'Nama toko (5–100 karakter)' })
  @IsString()
  @IsNotEmpty({ message: 'Nama toko wajib diisi' })
  @MinLength(5, { message: 'Nama toko minimal 5 karakter' })
  @MaxLength(100, { message: 'Nama toko maksimal 100 karakter' })
  name: string

  @ApiProperty({ example: 'Jl. Merdeka No. 10, Jakarta Pusat', description: 'Alamat lengkap toko (5–500 karakter)' })
  @IsString()
  @IsNotEmpty({ message: 'Alamat toko wajib diisi' })
  @MinLength(5, { message: 'Alamat toko minimal 5 karakter' })
  @MaxLength(500, { message: 'Alamat toko maksimal 500 karakter' })
  address: string

  @ApiPropertyOptional({ example: 'NIB-1234567890', description: 'Nomor registrasi usaha (opsional, maks. 50 karakter)' })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Nomor registrasi maksimal 50 karakter' })
  registrationNumber?: string
}
