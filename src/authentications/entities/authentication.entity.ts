import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '@/users/entities/user.entity'

/**
 * One row per active refresh token session.
 * When a refresh token is used, the old row is deleted and a new one inserted
 * (rotation). This prevents refresh token reuse attacks.
 */
@Entity('authentications')
export class Authentication {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id' })
  userId: string

  /**
   * Stores the bcrypt hash of the refresh token — never the raw token.
   * Comparing: bcrypt.compare(incomingRefreshToken, storedHash)
   */
  @Column({ name: 'refresh_token_hash', type: 'text' })
  refreshTokenHash: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @ManyToOne(() => User, (user) => user.authentications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User
}
