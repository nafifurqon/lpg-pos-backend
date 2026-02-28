import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterEmailDto {
  @ApiProperty({ example: 'user@example.com', description: 'Alamat email pengguna' })
  @IsString()
  @IsNotEmpty({ message: 'Email wajib diisi' })
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string

  /**
   * Password rules (enforced by class-validator; matching frontend Zod rules):
   * - At least 8 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  @ApiProperty({
    example: 'Secret@123',
    description: 'Password minimal 8 karakter, mengandung huruf kapital, huruf kecil, angka, dan karakter spesial',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @Matches(/[A-Z]/, { message: 'Password harus mengandung minimal satu huruf kapital' })
  @Matches(/[a-z]/, { message: 'Password harus mengandung minimal satu huruf kecil' })
  @Matches(/[0-9]/, { message: 'Password harus mengandung minimal satu angka' })
  @Matches(/[^A-Za-z0-9]/, { message: 'Password harus mengandung minimal satu karakter spesial' })
  password: string
}
