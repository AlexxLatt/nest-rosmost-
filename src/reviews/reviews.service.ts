import { UserEntity } from '@app/user/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateReviewsDto } from './dto/createReviews.dto';
import { ReviewsEntity } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewsResponseInterface } from './types/reviewsResponse.intarface';
import slugifay from 'slugify';
import slugify from 'slugify';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly reviewsRepository: Repository<ReviewsEntity>,
  ) {}
  async createReviews(
    currentUser: UserEntity,
    createReviewsDto: CreateReviewsDto,
  ): Promise<ReviewsEntity> {
    const review = new ReviewsEntity();
    Object.assign(review, createReviewsDto);
    review.author = currentUser;
    review.slug = this.getSlug(createReviewsDto.title);
    return await this.reviewsRepository.save(review);
  }
  buildReviewsResponse(review: ReviewsEntity): ReviewsResponseInterface {
    return { review };
  }
  private getSlug(title: string): string {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
