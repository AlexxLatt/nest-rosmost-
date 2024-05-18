import { MigrationInterface, QueryRunner } from 'typeorm';

export class addColumnInReviewUnfavoritesCountFix1715894165485
  implements MigrationInterface
{
  name = 'addColumnInReviewUnfavoritesCountFix1715894165485';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users_un_favorites_reviews" ("usersId" integer NOT NULL, "reviewsId" integer NOT NULL, CONSTRAINT "PK_f4d94bbc786b8b15f6dab7bc17e" PRIMARY KEY ("usersId", "reviewsId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2a16c15161a2ad21b82490e9cc" ON "users_un_favorites_reviews" ("usersId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61f677d86d106b8c53ad1e9490" ON "users_un_favorites_reviews" ("reviewsId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "users_un_favorites_reviews" ADD CONSTRAINT "FK_2a16c15161a2ad21b82490e9cc3" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_un_favorites_reviews" ADD CONSTRAINT "FK_61f677d86d106b8c53ad1e94906" FOREIGN KEY ("reviewsId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users_un_favorites_reviews" DROP CONSTRAINT "FK_61f677d86d106b8c53ad1e94906"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_un_favorites_reviews" DROP CONSTRAINT "FK_2a16c15161a2ad21b82490e9cc3"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_61f677d86d106b8c53ad1e9490"`);
    await queryRunner.query(`DROP INDEX "IDX_2a16c15161a2ad21b82490e9cc"`);
    await queryRunner.query(`DROP TABLE "users_un_favorites_reviews"`);
  }
}
