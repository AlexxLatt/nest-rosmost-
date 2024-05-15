import { BasketEntity } from '@app/basket/basket.entity';
import { ProductsEntity } from '@app/products/products.entity';
import { UserEntity } from '@app/user/user.entity';
import {
  BeforeUpdate,
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'reviews' })
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  slug: string;
  @Column()
  rating: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createAt: Date;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updateAt: Date;
  @Column({ default: 0 })
  favoritesCount: number;
  @BeforeUpdate()
  updateTimestamp() {
    this.updateAt = new Date();
  }
  @ManyToOne(() => UserEntity, (user) => user.reviews, { eager: true })
  author: UserEntity;
  @ManyToOne(() => ProductsEntity, (product) => product.reviews)
  product: ProductsEntity;
}
