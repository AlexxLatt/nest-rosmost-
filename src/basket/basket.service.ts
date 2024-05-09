import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BasketEntity } from './basket.entity';
import { UserEntity } from '@app/user/user.entity';
import { ProductsEntity } from '@app/products/products.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  // Метод для создания корзины для пользователя
  async createBasketForUser(userId: number): Promise<BasketEntity> {
    const user = await this.userRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let basket = await this.basketRepository.findOne({
      where: { user },
      relations: ['products'],
    });
    if (!basket) {
      basket = this.basketRepository.create({ user, products: [] });
      basket = await this.basketRepository.save(basket);
      user.basketId = basket.id;
      await this.userRepository.save(user); // Сохраняем пользователя
    } else {
      // Если корзина уже существует, просто вернем ее
      return basket;
    }
    // После сохранения пользователя вернем корзину
    return basket;
  }

  // Метод для добавления продукта в корзину пользователя
  async addProductToBasket(userId: number, productId: number) {
    const basket = await this.createBasketForUser(userId);
    const product = await this.productsRepository.findOne(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Проверяем, был ли уже куплен этот продукт
    if (product.isPurchased) {
      throw new ConflictException('Product already purchased');
    }

    // Проверяем, есть ли уже такой продукт в корзине пользователя
    const existingProduct = basket.products.find((p) => p.id === productId);
    if (existingProduct) {
      throw new ConflictException('Product already in basket');
    }

    product.isInBasket = true;
    product.basketId = basket.id; // Устанавливаем basketId
    basket.products.push(product);
    await this.productsRepository.save(product);
    return await this.basketRepository.save(basket);
  }

  // Метод для покупки корзины пользователя
  async purchaseBasket(userId: number) {
    const basket = await this.createBasketForUser(userId);
    if (basket.products.length === 0) {
      throw new NotFoundException('Basket is empty');
    }

    // Помечаем продукты в корзине как купленные и убираем их из корзины
    for (const product of basket.products) {
      if (product.isPurchased) {
        throw new ConflictException('Product already purchased');
      }
      product.isPurchased = true;
      product.isInBasket = false;

      await this.productsRepository.save(product);
    }

    // Очищаем корзину
    basket.products = [];

    // Сохраняем обновленную корзину с учетом купленных продуктов
    await this.basketRepository.save(basket);

    return basket; // Возвращаем обновленную корзину
  }

  async removeProductFromBasket(
    userId: number,
    productId: number,
  ): Promise<void> {
    const basket = await this.createBasketForUser(userId);
    console.log('Basket:', basket);
    const index = basket.products.findIndex(
      (product) => product.id === productId,
    );
    console.log('ProductId:', productId);
    console.log('Product:', basket.products[index]);
    console.log('Index:', index);
    if (index === -1) {
      throw new NotFoundException('Продукт не найден в корзине');
    }

    // Удаляем продукт из массива продуктов в корзине
    const removedProduct = basket.products.splice(index, 1)[0];

    // Обновляем корзину в базе данных
    await this.basketRepository.save(basket);

    // Ожидаем выполнение удаления продукта из базы данных
    await this.productsRepository.delete(productId);

    console.log('Removed product:', removedProduct);
  }
}
