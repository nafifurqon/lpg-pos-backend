import { IsEmail, IsString, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'Alamat email pengguna' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string

  @ApiProperty({ example: 'Secret@123', description: 'Password akun' })
  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string
}
