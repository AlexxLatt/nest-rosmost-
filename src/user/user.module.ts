import { Module } from '@nestjs/common';
import { UserContreller } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { AuthGuard } from './guards/auth.guard';
import { ProductsEntity } from '@app/products/products.entity';
import { BasketEntity } from '@app/basket/basket.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ProductsEntity, BasketEntity]),
  ],
  providers: [UserService, AuthGuard],
  controllers: [UserContreller],
  exports: [UserService],
})
export class UserModule {}
