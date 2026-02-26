import { MigrationInterface, QueryRunner } from 'typeorm'

export class AlterAuthentications1772006411000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cast created_at to TIMESTAMPTZ explicitly
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ALTER COLUMN "created_at" TYPE TIMESTAMPTZ
    `)

    // Allow null — null means the session is logged out
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ALTER COLUMN "refresh_token_hash" DROP NOT NULL
    `)

    // Add updated_at — TypeORM stamps this automatically on every save/update
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ADD COLUMN "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
    `)

    // UNIQUE on user_id enforces single-device and enables upsert ON CONFLICT
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ADD CONSTRAINT "UQ_authentications_user_id" UNIQUE ("user_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "authentications"
        DROP CONSTRAINT "UQ_authentications_user_id"
    `)
    await queryRunner.query(`ALTER TABLE "authentications" DROP COLUMN "updated_at"`)
    await queryRunner.query(`
      UPDATE "authentications" SET "refresh_token_hash" = '' WHERE "refresh_token_hash" IS NULL
    `)
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ALTER COLUMN "refresh_token_hash" SET NOT NULL
    `)
    await queryRunner.query(`
      ALTER TABLE "authentications"
        ALTER COLUMN "created_at" TYPE TIMESTAMP WITH TIME ZONE
    `)
  }
}
