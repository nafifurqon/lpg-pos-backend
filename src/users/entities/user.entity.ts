import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Authentication } from '@/authentications/entities/authentication.entity'

export enum UserRole {
  OWNER = 'owner',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  email: string

  /** Null for Google-only accounts. Stores bcrypt hash — never the raw password. */
  @Column({ name: 'password_hash', nullable: true, type: 'text' })
  passwordHash: string | null

  @Column({ name: 'google_id', nullable: true, type: 'text' })
  googleId: string | null

  @Column({ type: 'enum', enum: UserRole, default: UserRole.OWNER })
  role: UserRole

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date

  @OneToMany(() => Authentication, (auth) => auth.user, { cascade: true })
  authentications: Authentication[]
}
