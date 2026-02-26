import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  findById(id: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ id })
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email })
  }

  findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ googleId })
  }

  createEmailUser(email: string, passwordHash: string): Promise<User> {
    return this.usersRepo.save(this.usersRepo.create({ email, passwordHash }))
  }

  createGoogleUser(email: string, googleId: string): Promise<User> {
    return this.usersRepo.save(this.usersRepo.create({ email, googleId }))
  }
}
