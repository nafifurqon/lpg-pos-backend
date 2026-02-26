import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { AuthenticationsModule } from './authentications/authentications.module'
import { DashboardModule } from './dashboard/dashboard.module'

@Module({
  imports: [
    // Load .env variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // TypeORM connection — uses the same settings as data-source.ts
    // synchronize is always false; use migrations for all schema changes.
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        database: config.get<string>('DB_DATABASE', 'lpg_pos_db'),
        username: config.get<string>('DB_USERNAME', 'lpg_pos_user'),
        password: config.get<string>('DB_PASSWORD', 'lpg_pos_password'),
        synchronize: false,
        logging: config.get<string>('NODE_ENV') === 'development',
        entities: [__dirname + '/**/*.entity.{ts,js}'],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
        migrationsTableName: '_migrations',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UsersModule,
    AuthenticationsModule,
    DashboardModule,
  ],
})
export class AppModule {}
