import { hash } from 'bcrypt';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BasketEntity } from '@app/basket/basket.entity';
import { ReviewsEntity } from '@app/reviews/reviews.entity';
import { ProductsEntity } from '@app/products/products.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  img: string;

  @Column({ select: false })
  password: string;

  @Column({ nullable: true }) // Добавлено поле для хранения basketId
  basketId: number;

  @OneToMany(() => ReviewsEntity, (reviews) => reviews.author)
  reviews: ReviewsEntity[];

  @ManyToMany(() => ProductsEntity, (product) => product.users)
  purchasedProducts: ProductsEntity[];

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }

  @OneToOne(() => BasketEntity, (basket) => basket.user)
  @JoinColumn()
  basket: BasketEntity;
}
