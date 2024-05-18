import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsEntity } from './products.entity';
import { CreateProductsDto } from './dto/createProducts.dto';
import { BasketService } from '@app/basket/basket.service';
import { UserEntity } from '@app/user/user.entity';
import { UserProductEntity } from '@app/userProduct/userProduct.entity';
import { BasketEntity } from '@app/basket/basket.entity';
import { ProductResponseInterface } from './types/productResponse.interface';
import { ProductsResponseInterface } from './types/productsResponse.interface';
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

  async findOneProduct(
    userId: number,
    productId: number,
  ): Promise<ProductsEntity> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['basket', 'basket.products'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (!user.basket) {
      throw new NotFoundException('Корзина не найдена');
    }

    console.log('Корзина пользователя:', user.basket);
    console.log('Продукты в корзине:', user.basket.products);

    const product = user.basket.products.find(
      (product) => product.id === +productId,
    );

    console.log('Найденный продукт:', product);

    if (!product) {
      throw new NotFoundException('Продукт не найден в корзине');
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
    currentUserId: number,
  ): Promise<ProductsEntity> {
    const existingProduct = await this.findOneProduct(id, currentUserId);
    const updatedProduct = Object.assign(existingProduct, updateProductDto);
    return await this.productsRepository.save(updatedProduct);
  }

  buildProductResponse(product): ProductResponseInterface {
    return { product };
  }
  buildProductsResponse(products): ProductsResponseInterface {
    return { products };
  }
}
