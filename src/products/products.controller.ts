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
import { ProductResponseInterface } from './types/productResponse.interface';
import { ProductsResponseInterface } from './types/productsResponse.interface';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body('product') createProductDto: CreateProductsDto,
  ): Promise<ProductResponseInterface> {
    const product = await this.productsService.createProduct(createProductDto);
    return this.productsService.buildProductResponse(product);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @User('id') idUser: number,
  ): Promise<ProductsResponseInterface> {
    const product = await this.productsService.findAllProductsInBasket(idUser);
    return this.productsService.buildProductsResponse(product);
  }

  @Get('purchased')
  @UseGuards(AuthGuard)
  async findAllPurchased(
    @User('id') idUser: number,
  ): Promise<ProductsResponseInterface> {
    const products = await this.productsService.findAllPurchasedProducts(
      idUser,
    );
    return this.productsService.buildProductsResponse(products);
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async findAllWithStatus(
    @User('id') idUser: number,
  ): Promise<ProductsEntity[]> {
    return this.productsService.findAllProducts(idUser);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(
    @Param('id') id: number,
    @User('id') currentUserId: number,
  ): Promise<ProductResponseInterface> {
    const product = await this.productsService.findOneProduct(
      currentUserId,
      id,
    );
    return await this.productsService.buildProductResponse(product);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: number,
    @Body('product') updateProductDto: CreateProductsDto,
    @User('id') currentUserId: number,
  ): Promise<ProductsEntity> {
    return this.productsService.updateProduct(
      id,
      updateProductDto,
      currentUserId,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.productsService.removeProduct(id);
  }
}
