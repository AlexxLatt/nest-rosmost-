import { IsNotEmpty } from 'class-validator';
export class CreateProductsDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  country: string;
  @IsNotEmpty()
  cost: number;
  @IsNotEmpty()
  descr: string;
  tags: string[];
}
