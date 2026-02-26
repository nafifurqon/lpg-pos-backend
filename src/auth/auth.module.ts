import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAccessStrategy } from './strategies/jwt-access.strategy'
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy'
import { UsersModule } from '@/users/users.module'
import { AuthenticationsModule } from '@/authentications/authentications.module'

@Module({
  imports: [
    PassportModule,
    // JwtModule is registered here without a default secret; each sign() call
    // passes its own secret so both access and refresh tokens can coexist.
    JwtModule.register({}),
    UsersModule,
    AuthenticationsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
