import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { CreateProductsDto } from './dto/createProducts.dto';
import { BasketService } from '@app/basket/basket.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    private basketService: BasketService, // Внедряем BasketService
  ) {}

  async createProduct(
    createProductDto: CreateProductsDto,
  ): Promise<ProductsEntity> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAllProductsForUser(userId: number): Promise<ProductsEntity[]> {
    // Создаем или получаем корзину для пользователя
    const basket = await this.basketService.createBasketForUser(userId);

    // Получаем все продукты из базы данных с отношениями к отзывам
    const products = await this.productsRepository.find({
      relations: ['reviews'],
    });

    products.forEach((product) => {
      const isInBasket = basket.products.some((p) => p.id === product.id);
      product.isInBasket = isInBasket;

      if (!product.isPurchased) {
        const purchasedProduct = basket.products.find(
          (p) => p.id === product.id,
        );
        product.isPurchased = purchasedProduct
          ? purchasedProduct.isPurchased
          : false;
      }
    });

    return products;
  }
  async findOneProduct(id: number): Promise<ProductsEntity> {
    const product = await this.productsRepository.findOne(id, {
      relations: ['reviews'],
    });
    if (!product) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
    return product;
  }

  async removeProduct(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Продукт с ID ${id} не найден`);
    }
  }

  async updateProduct(
    id: number,
    updateProductDto: CreateProductsDto,
  ): Promise<ProductsEntity> {
    const existingProduct = await this.findOneProduct(id);
    const updatedProduct = Object.assign(existingProduct, updateProductDto);
    return await this.productsRepository.save(updatedProduct);
  }
}
