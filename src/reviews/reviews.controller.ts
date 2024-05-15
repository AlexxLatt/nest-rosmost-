import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateReviewsDto } from './dto/createReviews.dto';
import { ReviewsResponseInterface } from './types/reviewsResponse.intarface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @User() currentUser: UserEntity,
    @Body('productId') productId: number, // Переносим идентификатор продукта в тело запроса
    @Body('reviews') createReviewsDto: CreateReviewsDto, // Изменяем имя поля на 'review'
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.createReviews(
      currentUser,
      productId, // Передаем идентификатор продукта
      createReviewsDto,
    );
    return this.reviewsService.buildReviewsResponse(review);
  }

  @Get(':slug')
  async getReview(
    @Param('slug') slug: string,
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.findReview(slug);
    return this.reviewsService.buildReviewsResponse(review);
  }

  @Delete(':slug')
  @UseGuards(AuthGuard)
  async deleteReview(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ) {
    return this.reviewsService.deleteReview(slug, currentUserId);
  }
}
