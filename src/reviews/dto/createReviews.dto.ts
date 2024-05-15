import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateReviewsDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  @IsNumber()
  rating: number;
  @IsNotEmpty()
  description: string;
}
