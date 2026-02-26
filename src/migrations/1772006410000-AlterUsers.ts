import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterUsers1772006410000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cast created_at / updated_at to TIMESTAMPTZ explicitly
    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "created_at" TYPE TIMESTAMPTZ,
        ALTER COLUMN "updated_at" TYPE TIMESTAMPTZ
    `)

    // Drop provider column and enum (no longer used)
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "provider"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_provider_enum"`)

    // Add role column
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum" AS ENUM ('owner')
    `)
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN "role" "public"."user_role_enum" NOT NULL DEFAULT 'owner'
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`)
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."user_role_enum"`)

    await queryRunner.query(`
      CREATE TYPE "public"."users_provider_enum" AS ENUM ('email', 'google')
    `)
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN "provider" "public"."users_provider_enum" NOT NULL DEFAULT 'email'
    `)

    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE,
        ALTER COLUMN "updated_at" TYPE TIMESTAMP WITH TIME ZONE
    `)
  }
}
