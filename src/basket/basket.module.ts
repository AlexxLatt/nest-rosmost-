import { Module } from '@nestjs/common';
import { BasketController } from './basket.controller';
import { BasketService } from './basket.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './basket.entity';
import { ProductsEntity } from '@app/products/products.entity';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';
import { UserProductEntity } from '@app/userProduct/userProduct.entity';

@Module({
  controllers: [BasketController],
  providers: [BasketService],
  imports: [
    TypeOrmModule.forFeature([
      BasketEntity,
      ProductsEntity,
      UserEntity,
      UserProductEntity,
    ]),
  ],
})
export class BasketModule {}
