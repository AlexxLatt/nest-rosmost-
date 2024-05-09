import { BasketEntity } from '@app/basket/basket.entity';
import { ReviewsEntity } from '@app/reviews/reviews.entity';
import { UserEntity } from '@app/user/user.entity';
import {
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';

@Entity({ name: 'products' })
export class ProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  country: string;

  @Column()
  cost: number;

  @Column()
  desc: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @OneToMany(() => ReviewsEntity, (review) => review.product)
  reviews: ReviewsEntity[];

  @ManyToOne(() => BasketEntity, (basket) => basket.products)
  basket: BasketEntity;

  @ManyToMany(() => UserEntity, (user) => user.purchasedProducts)
  users: UserEntity[];

  @Column({ default: false }) // По умолчанию продукт не находится в корзине
  isInBasket: boolean;

  @Column({ default: false }) // По умолчанию продукт не куплен
  isPurchased: boolean;

  @Column({ nullable: true }) // Добавляем поле для хранения basketId
  basketId: number;
  ProductsEntity: any;
}
