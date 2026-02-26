import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Authentication } from './entities/authentication.entity'

@Injectable()
export class AuthenticationsService {
  constructor(
    @InjectRepository(Authentication)
    private readonly authRepo: Repository<Authentication>,
  ) {}

  /**
   * Upsert session: insert a new row if the user has no session,
   * or update the hash if one already exists.
   * The UNIQUE constraint on user_id enables the ON CONFLICT path,
   * naturally enforcing single-device login.
   *
   * Why hash the refresh token?
   * A refresh token grants long-lived access (7 days) — similar to a password.
   * Hashing means a leaked DB cannot be used to forge new access tokens directly.
   */
  async replaceSession(userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12)
    await this.authRepo.upsert(
      { userId, refreshTokenHash },
      { conflictPaths: ['userId'] },
    )
  }

  /**
   * Validate the presented refresh token against the stored bcrypt hash.
   * Returns null if no session exists, if the session is logged out (hash is null),
   * or if the token doesn't match.
   */
  async validateRefreshToken(userId: string, refreshToken: string): Promise<Authentication | null> {
    const session = await this.authRepo.findOneBy({ userId })
    if (!session || !session.refreshTokenHash) return null
    const valid = await bcrypt.compare(refreshToken, session.refreshTokenHash)
    return valid ? session : null
  }

  /** Update hash in-place after a successful token refresh. */
  async updateSessionToken(userId: string, newRefreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(newRefreshToken, 12)
    await this.authRepo.update({ userId }, { refreshTokenHash })
  }

  /**
   * Logout: set hash to null and stamp updated_at.
   * Row is kept for audit — a non-null updated_at with null hash = logged out.
   */
  async clearSession(userId: string): Promise<void> {
    await this.authRepo.update({ userId }, { refreshTokenHash: null })
  }
}
