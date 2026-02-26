import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class LoginEmailDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  password: string
}
