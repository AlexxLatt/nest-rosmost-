// basket.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProductsEntity } from '@app/products/products.entity';

@Entity({ name: 'basket' })
export class BasketEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // Добавлено поле для связи с пользователем

  @ManyToOne(() => UserEntity, (user) => user.basket)
  user: UserEntity;

  @OneToMany(() => ProductsEntity, (product) => product.basket)
  products: ProductsEntity[];
}
