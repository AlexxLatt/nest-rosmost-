import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { CreateProductsDto } from './dto/createProducts.dto';
import { BasketService } from '@app/basket/basket.service';
import { UserEntity } from '@app/user/user.entity';
import { UserProductEntity } from '@app/userProduct/userProduct.entity';
import { BasketEntity } from '@app/basket/basket.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(UserProductEntity) // Инжектируем репозиторий UserProductEntity
    private userProductRepository: Repository<UserProductEntity>,
    private basketService: BasketService,
  ) {}

  async createProduct(
    createProductDto: CreateProductsDto,
  ): Promise<ProductsEntity> {
    const product = this.productsRepository.create(createProductDto);
    return await this.productsRepository.save(product);
  }

  async findAllProductsInBasket(userId: number): Promise<ProductsEntity[]> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['basket', 'basket.products'],
    });
    if (!user || !user.basket) {
      throw new NotFoundException('Basket not found');
    }

    return user.basket.products;
  }

  async findAllPurchasedProducts(userId: number): Promise<ProductsEntity[]> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['basket', 'basket.products'],
    });
    if (!user || !user.basket) {
      throw new NotFoundException('Basket not found');
    }

    // Возвращаем только купленные продукты
    return user.basket.products.filter((product) => product.isPurchased);
  }

  async findAllProducts(userId: number): Promise<ProductsEntity[]> {
    const products = await this.productsRepository.find({
      relations: ['reviews'],
    });

    // Получаем корзину пользователя
    const basket = await this.basketService.createBasketForUser(userId);

    // Помечаем каждый продукт в соответствии с его статусом (куплен, в корзине или нет)
    products.forEach((product) => {
      const isInBasket = basket.products.some((p) => p.id === product.id);
      if (!product.isPurchased) {
        const purchasedProduct = basket.products.find(
          (p) => p.id === product.id,
        );
        product.isPurchased = purchasedProduct
          ? purchasedProduct.isPurchased
          : false;
      }
      delete product.isInBasket;
      delete product.isPurchased;
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
