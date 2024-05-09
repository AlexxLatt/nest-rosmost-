import { IsNotEmpty } from 'class-validator';

export class CreateReviewsDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  rating: number;
  @IsNotEmpty()
  descr: string;
}
