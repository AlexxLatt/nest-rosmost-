import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixAll1715908565782 implements MigrationInterface {
  name = 'FixAll1715908565782';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD "unfavoritesCount" integer NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP COLUMN "unfavoritesCount"`,
    );
  }
}
