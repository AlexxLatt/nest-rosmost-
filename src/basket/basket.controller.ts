import { Controller, Post, UseGuards, Param, Delete } from '@nestjs/common';
import { BasketService } from './basket.service';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { User } from '@app/user/decorators/user.decorator';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}
  @Post('purchase') // измененный путь
  @UseGuards(AuthGuard)
  async purchaseBasket(@User('id') userId: number) {
    return await this.basketService.purchaseBasket(userId);
  }
  @Post(':productId')
  @UseGuards(AuthGuard)
  async addProductToBasket(
    @User('id') userId: number,
    @Param('productId') productId: number,
  ) {
    return await this.basketService.addProductToBasket(userId, productId);
  }

  @Delete(':productId')
  @UseGuards(AuthGuard)
  async removeProductFromBasket(
    @User('id') userId: number,
    @Param('productId') productId: number,
  ) {
    return await this.basketService.removeProductFromBasket(userId, productId);
  }

  @Post() // Новый метод для создания корзины
  @UseGuards(AuthGuard)
  async createBasketForUser(@User('id') userId: number) {
    return await this.basketService.createBasketForUser(userId);
  }
}
