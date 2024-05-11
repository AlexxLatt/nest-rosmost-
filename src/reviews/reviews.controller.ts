import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    @Body('reviews') createReviewsDto: CreateReviewsDto,
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.createReviews(
      currentUser,
      createReviewsDto,
    );
    return this.reviewsService.buildReviewsResponse(review);
  }
}
