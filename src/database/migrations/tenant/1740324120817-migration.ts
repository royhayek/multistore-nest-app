import { MigrationInterface, QueryRunner } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export class Migration1740324120817 implements MigrationInterface {
  name = 'Migration1740324120817';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `CREATE TABLE "${schema}"."role" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."user_statuses" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_50cc8fb0f4810b2f3bfcef7a788" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."users" ("id" SERIAL NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying, "phoneNumber" character varying NOT NULL, "password" character varying, "roleId" integer NOT NULL DEFAULT '1', "statusId" integer NOT NULL DEFAULT '1', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5372672fbfd1677205e0ce3ece" ON "${schema}"."users" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_af99afb7cf88ce20aff6977e68" ON "${schema}"."users" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "${schema}"."session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "permission" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "roleId" integer, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."product_statuses" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_9a42830a21aa98283f6eba807aa" UNIQUE ("name"), CONSTRAINT "PK_d82b6ccd4f16a294aa02b285703" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "${schema}"."file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "${schema}"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" ADD CONSTRAINT "FK_fffa7945e50138103659f6326b7" FOREIGN KEY ("statusId") REFERENCES "${schema}"."user_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "${schema}"."users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."permission" ADD CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e" FOREIGN KEY ("roleId") REFERENCES "${schema}"."role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const { schema } = queryRunner.connection
      .options as PostgresConnectionOptions;
    await queryRunner.query(
      `ALTER TABLE "${schema}"."permission" DROP CONSTRAINT "FK_cdb4db95384a1cf7a837c4c683e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" DROP CONSTRAINT "FK_fffa7945e50138103659f6326b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "${schema}"."users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."file"`);
    await queryRunner.query(`DROP TABLE "${schema}"."product_statuses"`);
    await queryRunner.query(`DROP TABLE "${schema}"."permission"`);
    await queryRunner.query(
      `DROP INDEX "${schema}"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."session"`);
    await queryRunner.query(
      `DROP INDEX "${schema}"."IDX_af99afb7cf88ce20aff6977e68"`,
    );
    await queryRunner.query(
      `DROP INDEX "${schema}"."IDX_5372672fbfd1677205e0ce3ece"`,
    );
    await queryRunner.query(`DROP TABLE "${schema}"."users"`);
    await queryRunner.query(`DROP TABLE "${schema}"."user_statuses"`);
    await queryRunner.query(`DROP TABLE "${schema}"."role"`);
  }
}
