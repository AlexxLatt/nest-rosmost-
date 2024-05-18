import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';
import { UserEntity } from '@app/user/user.entity';
import { CreateReviewsDto } from './dto/createReviews.dto';
import { ReviewsResponseInterface } from './types/reviewsResponse.intarface';
import { query } from 'express';
import { ReviewsSResponseInterface } from './types/reviewsSResponse.intarface';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Post(':productId')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(
    @User() currentUser: UserEntity,
    @Param('productId') productId: number,
    @Body('reviews') createReviewsDto: CreateReviewsDto,
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.createReviews(
      currentUser,
      productId,
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

  @Put(':slug')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateReview(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
    @Body('reviews') updateReviewsDto: CreateReviewsDto,
  ) {
    const review = await this.reviewsService.updateReview(
      slug,
      currentUserId,
      updateReviewsDto,
    );
    return this.reviewsService.buildReviewsResponse(review);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @User('id') currentUserId: number,
    @Query('productId') productId: string,
    @Query() query: any,
  ): Promise<ReviewsSResponseInterface> {
    const parsedProductId = parseInt(productId, 10);
    if (isNaN(parsedProductId)) {
      throw new Error('Product ID must be a valid number');
    }
    return await this.reviewsService.findAll(
      currentUserId,
      parsedProductId,
      query,
    );
  }

  @Post(':slug/favorite')
  @UseGuards(AuthGuard)
  async likeReviews(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.likeReview(slug, currentUserId);
    return this.reviewsService.buildReviewsResponse(review);
  }

  @Delete(':slug/favorite')
  @UseGuards(AuthGuard)
  async DeleteLikeReviews(
    @User('id') currentUserId: number,
    @Param('slug') slug: string,
  ): Promise<ReviewsResponseInterface> {
    const review = await this.reviewsService.DeleteLikeReview(
      slug,
      currentUserId,
    );
    return this.reviewsService.buildReviewsResponse(review);
  }
}
