import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsEntity } from './products.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketService } from '@app/basket/basket.service';
import { BasketEntity } from '@app/basket/basket.entity';
import { UserEntity } from '@app/user/user.entity';
import { UserService } from '@app/user/user.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, BasketService, UserService],
  imports: [
    TypeOrmModule.forFeature([ProductsEntity, BasketEntity, UserEntity]),
  ], // Включаем BasketEntity и UserRepository в TypeOrmModule
})
export class ProdutsModule {}
