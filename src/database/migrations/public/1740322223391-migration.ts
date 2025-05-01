import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1740322223391 implements MigrationInterface {
  name = 'Migration1740322223391';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "store" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "domain" character varying NOT NULL, "schemaId" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_13e5af466c152cf169a8048232b" UNIQUE ("domain"), CONSTRAINT "UQ_a325c7d778056a2313a0960ab6e" UNIQUE ("schemaId"), CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "permission" ADD CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission" DROP CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e"`,
    );
    await queryRunner.query(`DROP TABLE "store"`);
    await queryRunner.query(`DROP TABLE "permission"`);
  }
}
