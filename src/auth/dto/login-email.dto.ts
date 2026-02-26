import { IsEmail, IsString, IsNotEmpty } from 'class-validator'

export class LoginEmailDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  @IsNotEmpty({ message: 'Email wajib diisi' })
  email: string

  @IsString()
  @IsNotEmpty({ message: 'Password wajib diisi' })
  password: string
}
