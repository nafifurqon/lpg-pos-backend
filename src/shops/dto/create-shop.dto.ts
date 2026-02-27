import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator'

export class CreateShopDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama toko wajib diisi' })
  @MinLength(5, { message: 'Nama toko minimal 5 karakter' })
  @MaxLength(100, { message: 'Nama toko maksimal 100 karakter' })
  name: string

  @IsString()
  @IsNotEmpty({ message: 'Alamat toko wajib diisi' })
  @MinLength(5, { message: 'Alamat toko minimal 5 karakter' })
  @MaxLength(500, { message: 'Alamat toko maksimal 500 karakter' })
  address: string

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Nomor registrasi maksimal 50 karakter' })
  registrationNumber?: string
}
