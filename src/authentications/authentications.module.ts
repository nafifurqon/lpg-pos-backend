import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Authentication } from './entities/authentication.entity'
import { AuthenticationsService } from './authentications.service'

@Module({
  imports: [TypeOrmModule.forFeature([Authentication])],
  providers: [AuthenticationsService],
  exports: [AuthenticationsService],
})
export class AuthenticationsModule {}
