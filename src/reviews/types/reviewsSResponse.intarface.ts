import { ReviewsEntity } from '../reviews.entity';

export interface ReviewsSResponseInterface {
  reviews: ReviewsEntity[];
  reviewsCount: number;
}
