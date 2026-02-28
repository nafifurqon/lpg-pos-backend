import { ApiProperty } from '@nestjs/swagger'
import { UserRole } from '@/users/entities/user.entity'

export class UserInAuthDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'User UUID' })
  id: string

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  email: string

  @ApiProperty({ example: UserRole.OWNER, enum: UserRole, description: 'User role' })
  role: UserRole
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Short-lived JWT access token' })
  access_token: string

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Long-lived JWT refresh token' })
  refresh_token: string

  @ApiProperty({ type: () => UserInAuthDto, description: 'Authenticated user info' })
  user: UserInAuthDto
}
