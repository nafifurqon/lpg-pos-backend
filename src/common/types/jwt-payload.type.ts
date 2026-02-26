import { UserRole } from '@/users/entities/user.entity'

/**
 * Single payload type embedded in both access and refresh JWTs.
 * Using one type keeps access and refresh tokens structurally identical —
 * only the secret and expiry differ.
 */
export type JwtPayload = {
  sub: string      // user.id (UUID)
  email: string
  role: UserRole
}
