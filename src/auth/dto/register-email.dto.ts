import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class RegisterEmailDto {
  @IsEmail()
  email: string

  /**
   * Password rules (enforced by class-validator; matching frontend Zod rules):
   * - 8–72 characters
   * - At least one uppercase letter
   * - At least one lowercase letter
   * - At least one number
   * - At least one special character
   */
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string
}
