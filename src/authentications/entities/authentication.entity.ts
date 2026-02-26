import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import { User } from '@/users/entities/user.entity'

/**
 * One row per user — enforced by UNIQUE constraint on user_id (single-device).
 * On login/register: upsert — insert new or overwrite existing hash.
 * On refresh: hash updated in-place.
 * On logout: hash set to null; row is kept for audit.
 */
@Entity('authentications')
export class Authentication {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', unique: true })
  userId: string

  /**
   * Null when logged out.
   * Bcrypt-hashed — a leaked DB can't be used to forge tokens directly.
   */
  @Column({ name: 'refresh_token_hash', type: 'text', nullable: true })
  refreshTokenHash: string | null

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.authentications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User
}
