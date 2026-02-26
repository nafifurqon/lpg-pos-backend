import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateAuthenticationsTable1772006401000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "authentications" (
        "id"                   UUID    NOT NULL DEFAULT gen_random_uuid(),
        "user_id"              UUID    NOT NULL,
        "refresh_token_hash"   TEXT    NOT NULL,
        "created_at"           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_authentications_id"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_authentications_user_id"  FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE INDEX "IDX_authentications_user_id" ON "authentications" ("user_id")
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_authentications_user_id"`)
    await queryRunner.query(`DROP TABLE "authentications"`)
  }
}
