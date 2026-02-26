import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Authentication } from '@/authentications/entities/authentication.entity'

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  /**
   * Null for Google-only accounts (no password set).
   * Stores bcrypt hash — never the raw password.
   */
  @Column({ name: 'password_hash', nullable: true, type: 'text' })
  passwordHash: string | null

  @Column({
    type: 'enum',
    enum: AuthProvider,
    default: AuthProvider.EMAIL,
  })
  provider: AuthProvider

  @Column({ name: 'google_id', nullable: true, type: 'text' })
  googleId: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToMany(() => Authentication, (auth) => auth.user, { cascade: true })
  authentications: Authentication[]
}
