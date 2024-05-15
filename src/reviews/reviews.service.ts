import { UserEntity } from '@app/user/user.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewsDto } from './dto/createReviews.dto';
import { ReviewsEntity } from './reviews.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, getRepository } from 'typeorm';
import { ReviewsResponseInterface } from './types/reviewsResponse.intarface';
import { ProductsEntity } from '@app/products/products.entity';
import slugifay from 'slugify';
import slugify from 'slugify';
import { Query } from 'typeorm/driver/Query';
import { ReviewsSResponseInterface } from './types/reviewsSResponse.intarface';
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
  async updateReview(
    slug: string,
    currentUserId: number,
    updateReviewsDto: CreateReviewsDto,
  ): Promise<ReviewsEntity> {
    const review = await this.findReview(slug);
    if (!review) {
      throw new HttpException('Review does not exist', HttpStatus.NOT_FOUND);
    }
    if (review.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }
    const updatedReview = Object.assign(review, updateReviewsDto);
    return await this.productsRepository.save(updatedReview);
  }
  async findAll(
    currentUserId: number,
    productId: number,
    query: any,
  ): Promise<ReviewsSResponseInterface> {
    const queryBuilder = getRepository(ReviewsEntity)
      .createQueryBuilder('reviews')
      .leftJoinAndSelect('reviews.author', 'author')
      .where('reviews.product.id = :productId', { productId });

    queryBuilder.orderBy('reviews.createAt', 'DESC');

    if (query.rating) {
      // Проверяем, что рейтинг находится в допустимом диапазоне (от 1 до 5)
      if (query.rating >= 1 && query.rating <= 5) {
        // Добавляем условие фильтрации по рейтингу
        queryBuilder.andWhere('reviews.rating = :rating', {
          rating: query.rating,
        });
      } else {
        // Если рейтинг не входит в диапазон от 1 до 5, выбрасываем ошибку или обрабатываем ситуацию по вашему усмотрению
        throw new BadRequestException(
          'Invalid rating value. Rating should be between 1 and 5.',
        );
      }
    }
    const reviewsCount = await queryBuilder.getCount();
    const reviews = await queryBuilder.getMany();

    return { reviews, reviewsCount };
  }
}
