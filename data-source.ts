import 'reflect-metadata'
import 'tsconfig-paths/register'
import { DataSource } from 'typeorm'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load .env from backend directory
dotenv.config({ path: path.join(__dirname, '.env') })

/**
 * TypeORM DataSource used by the migration CLI.
 *
 * Usage:
 *   Generate a new migration (after modifying entities):
 *     npm run migration:generate src/migrations/<MigrationName>
 *
 *   Apply pending migrations:
 *     npm run migration:run
 *
 *   Revert the last migration:
 *     npm run migration:revert
 *
 *   Show migration status:
 *     npm run migration:status
 *
 * Rules:
 *   - NEVER modify an already-applied migration file.
 *   - All schema changes (tables, columns, indexes) must go through migrations.
 *   - synchronize is always false in all environments.
 */
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  database: process.env.DB_DATABASE ?? 'lpg_pos_db',
  username: process.env.DB_USERNAME ?? 'lpg_pos_user',
  password: process.env.DB_PASSWORD ?? 'lpg_pos_password',

  // Auto-sync is intentionally disabled. Use migrations instead.
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',

  // Entity files — TypeORM scans these to detect schema changes
  entities: [path.join(__dirname, 'src/**/*.entity.{ts,js}')],

  // Migration files
  migrations: [path.join(__dirname, 'src/migrations/*.{ts,js}')],
  migrationsTableName: '_migrations',
})
