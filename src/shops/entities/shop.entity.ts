import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { User } from '@/users/entities/user.entity'

@Entity('shops')
export class Shop {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'Shop UUID' })
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ApiProperty({ example: 'Toko Sumber Gas', description: 'Nama toko' })
  @Column({ type: 'varchar', length: 100 })
  name: string

  @ApiProperty({ example: 'Jl. Merdeka No. 10, Jakarta Pusat', description: 'Alamat lengkap toko' })
  @Column({ type: 'varchar', length: 500 })
  address: string

  @ApiPropertyOptional({ example: 'NIB-1234567890', nullable: true, description: 'Nomor registrasi usaha' })
  @Column({ name: 'registration_number', type: 'varchar', length: 50, nullable: true })
  registrationNumber: string | null

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID owner toko' })
  @Column({ name: 'owner_id', type: 'uuid', unique: true })
  ownerId: string

  @ApiProperty({ example: '2026-02-28T00:00:00.000Z', description: 'Waktu toko dibuat' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @ApiProperty({ example: '2026-02-28T00:00:00.000Z', description: 'Waktu toko terakhir diperbarui' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date
}
