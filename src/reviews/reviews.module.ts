import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsEntity } from './reviews.entity';
import { ProductsEntity } from '@app/products/products.entity';
import { UserEntity } from '@app/user/user.entity';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
  imports: [
    TypeOrmModule.forFeature([ReviewsEntity, ProductsEntity, UserEntity]),
  ],
})
export class ReviewsModule {}
