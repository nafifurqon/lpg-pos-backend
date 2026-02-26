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

  async createSession(userId: string, refreshToken: string): Promise<Authentication> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12)
    const session = this.authRepo.create({ userId, refreshTokenHash })
    return this.authRepo.save(session)
  }

  /** Insert a session with a pre-generated ID (used to embed the ID in the JWT before DB write). */
  async createSessionWithId(id: string, userId: string, refreshToken: string): Promise<void> {
    const refreshTokenHash = await bcrypt.hash(refreshToken, 12)
    await this.authRepo.save(this.authRepo.create({ id, userId, refreshTokenHash }))
  }

  async findById(id: string): Promise<Authentication | null> {
    return this.authRepo.findOneBy({ id })
  }

  /**
   * Validate refresh token by checking the bcrypt hash stored in the session.
   * Returns the session if valid, null otherwise.
   */
  async validateRefreshToken(authId: string, refreshToken: string): Promise<Authentication | null> {
    const session = await this.authRepo.findOneBy({ id: authId })
    if (!session) return null
    const valid = await bcrypt.compare(refreshToken, session.refreshTokenHash)
    return valid ? session : null
  }

  /** Delete a specific session (logout from one device). */
  async deleteSession(authId: string): Promise<void> {
    await this.authRepo.delete({ id: authId })
  }

  /** Delete all sessions for a user (logout from all devices). */
  async deleteAllSessions(userId: string): Promise<void> {
    await this.authRepo.delete({ userId })
  }
}
