import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GoogleAuthDto {
  @ApiProperty({
    example: '4/0AX4XfWh...',
    description: 'Authorization code dari Google OAuth consent screen (auth-code flow)',
  })
  /** Authorization code from Google OAuth consent screen (auth-code flow). */
  @IsString()
  code: string
}
