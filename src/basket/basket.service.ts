import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasketEntity } from './basket.entity';
import { ProductsEntity } from '@app/products/products.entity';
import { UserEntity } from '@app/user/user.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity)
    private basketRepository: Repository<BasketEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(ProductsEntity)
    private productsRepository: Repository<ProductsEntity>,
  ) {}

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

  async purchaseBasket(userId: number): Promise<BasketEntity> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['basket', 'basket.products'],
    });
    if (!user || !user.basket) {
      throw new NotFoundException('Basket not found');
    }

    const basket = user.basket;

    // Обновляем каждый продукт в корзине
    basket.products.forEach((product) => {
      product.isInBasket = false; // Устанавливаем isInBasket в false
      product.isPurchased = true; // Устанавливаем isPurchased в true
    });

    // Сохраняем обновленные продукты
    await this.productsRepository.save(basket.products);

    // Очищаем корзину
    basket.products = [];

    // Сохраняем обновленную корзину
    await this.basketRepository.save(basket);

    return basket;
  }

  async removeProductFromBasket(
    userId: number,
    productId: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne(userId, {
      relations: ['basket', 'basket.products'],
    });
    if (!user || !user.basket) {
      throw new NotFoundException('Basket not found');
    }

    const basket = user.basket;
    console.log('basket', basket);
    console.log('basket.products', basket.products);
    console.log('productId', productId);
    console.log('Length of basket products:', basket.products.length);

    // Убедимся, что продукты корзины успешно загружены
    if (basket.products.length === 0) {
      throw new NotFoundException('Products not found in basket');
    }

    // Находим продукт, который нужно удалить
    const productToRemoveIndex = basket.products.findIndex(
      (product) => product.id === +productId,
    );
    if (productToRemoveIndex === -1) {
      throw new NotFoundException('Product not found in basket');
    }

    // Устанавливаем isInBasket в false для удаленного продукта
    basket.products[productToRemoveIndex].isInBasket = false;
    console.log('Basket before saving:', basket);
    // Удаляем продукт из массива
    basket.products.splice(productToRemoveIndex, 1);
    const product = await this.productsRepository.findOne(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.isInBasket = false; // Устанавливаем isInBasket в false

    try {
      await this.productsRepository.save(product); // Сохраняем обновленную информацию о продукте
    } catch (error) {
      console.error('Error while saving product:', error);
      throw new InternalServerErrorException('Error while saving product');
    }
    try {
      // Сохраняем изменения корзины
      await this.basketRepository.save(basket);
      console.log('Basket successfully saved');
    } catch (error) {
      console.error('Error while saving basket:', error);
      throw new InternalServerErrorException('Error while saving basket');
    }

    console.log('Basket after removing product:', basket);
  }
}
