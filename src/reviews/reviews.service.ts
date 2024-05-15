import { UserEntity } from '@app/user/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewsDto } from './dto/createReviews.dto';
import { ReviewsEntity } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ReviewsResponseInterface } from './types/reviewsResponse.intarface';
import { ProductsEntity } from '@app/products/products.entity';
import slugifay from 'slugify';
import slugify from 'slugify';
@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsEntity)
    private readonly reviewsRepository: Repository<ReviewsEntity>,
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
  ) {}
  async createReviews(
    currentUser: UserEntity,
    productId: number,
    createReviewsDto: CreateReviewsDto,
  ): Promise<ReviewsEntity> {
    // Находим продукт по его идентификатору
    const product = await this.productsRepository.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    delete product.isInBasket;
    delete product.isPurchased;
    // Создаем новый отзыв и присваиваем ему свойства
    const review = new ReviewsEntity();
    Object.assign(review, createReviewsDto);
    review.author = currentUser;
    review.product = product; // Устанавливаем связь с продуктом
    review.slug = this.getSlug(createReviewsDto.title);

    // Сохраняем отзыв в базе данных
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

  findReview(slug: string): Promise<ReviewsEntity> {
    const review = this.reviewsRepository.findOne({ slug });
    return review;
  }
  async deleteReview(
    slug: string,
    currentUserId: number,
  ): Promise<DeleteResult> {
    const review = await this.findReview(slug);
    if (!review) {
      throw new HttpException('Review does not exist', HttpStatus.NOT_FOUND);
    }
    if (review.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    console.log('review', review);
    return await this.reviewsRepository.delete({ slug });
  }
}
