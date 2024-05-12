import {MigrationInterface, QueryRunner} from "typeorm";

export class СreateUserProducts1715464837024 implements MigrationInterface {
    name = 'СreateUserProducts1715464837024'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_product_entity" ("id" SERIAL NOT NULL, "isPurchased" boolean NOT NULL DEFAULT false, "userId" integer, "productId" integer, CONSTRAINT "PK_4fa2edd17de05fd5778b4c22e1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_product_entity" ADD CONSTRAINT "FK_38ca4bde8a3bce0b71c9e34b8fc" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_product_entity" ADD CONSTRAINT "FK_f640672d1dfc1d9e6fb96b4529f" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_product_entity" DROP CONSTRAINT "FK_f640672d1dfc1d9e6fb96b4529f"`);
        await queryRunner.query(`ALTER TABLE "user_product_entity" DROP CONSTRAINT "FK_38ca4bde8a3bce0b71c9e34b8fc"`);
        await queryRunner.query(`DROP TABLE "user_product_entity"`);
    }

}
