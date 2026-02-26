import { IsString } from 'class-validator'

export class GoogleAuthDto {
  /** Authorization code from Google OAuth consent screen (auth-code flow). */
  @IsString()
  code: string
}
