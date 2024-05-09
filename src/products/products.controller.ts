import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDto } from './dto/createProducts.dto';
import { ProductsEntity } from './products.entity';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body('product') createProductDto: CreateProductsDto,
  ): Promise<ProductsEntity> {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(@User('id') idUser: number): Promise<ProductsEntity[]> {
    return this.productsService.findAllProductsForUser(idUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: number): Promise<ProductsEntity> {
    return this.productsService.findOneProduct(id);
  }

  @Put(':id') // Используем метод PUT для обновления
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body('product') updateProductDto: CreateProductsDto,
  ): Promise<ProductsEntity> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.productsService.removeProduct(id);
  }
}
