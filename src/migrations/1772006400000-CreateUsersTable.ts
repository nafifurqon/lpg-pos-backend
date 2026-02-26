import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1772006400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "public"."users_provider_enum" AS ENUM ('email', 'google')
    `)

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID              NOT NULL DEFAULT gen_random_uuid(),
        "email"         VARCHAR            NOT NULL,
        "password_hash" TEXT,
        "provider"      "public"."users_provider_enum" NOT NULL DEFAULT 'email',
        "google_id"     TEXT,
        "created_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email"  UNIQUE ("email"),
        CONSTRAINT "PK_users_id"     PRIMARY KEY ("id")
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`)
    await queryRunner.query(`DROP TYPE "public"."users_provider_enum"`)
  }
}
