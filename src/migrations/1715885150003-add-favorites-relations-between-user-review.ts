import { MigrationInterface, QueryRunner } from 'typeorm';

export class addFavoritesRelationsBetweenUserReview1715885150003
  implements MigrationInterface
{
  name = 'addFavoritesRelationsBetweenUserReview1715885150003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_favorites_reviews" ("usersId" integer NOT NULL, "reviewsId" integer NOT NULL, CONSTRAINT "PK_83fb26e427b0f4b172fc8bff387" PRIMARY KEY ("usersId", "reviewsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1510dbdeec8526653435bde719" ON "users_favorites_reviews" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3e819cc6f6a2453d06583a1d83" ON "users_favorites_reviews" ("reviewsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_reviews" ADD CONSTRAINT "FK_1510dbdeec8526653435bde7197" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_reviews" ADD CONSTRAINT "FK_3e819cc6f6a2453d06583a1d83d" FOREIGN KEY ("reviewsId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_favorites_reviews" DROP CONSTRAINT "FK_3e819cc6f6a2453d06583a1d83d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_reviews" DROP CONSTRAINT "FK_1510dbdeec8526653435bde7197"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_3e819cc6f6a2453d06583a1d83"`);
    await queryRunner.query(`DROP INDEX "IDX_1510dbdeec8526653435bde719"`);
    await queryRunner.query(`DROP TABLE "users_favorites_reviews"`);
  }
}
