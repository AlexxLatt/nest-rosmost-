import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '@app/user/user.entity';
import { ProductsEntity } from '@app/products/products.entity';
@Entity()
export class UserProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.userProducts)
  user: UserEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.userProducts)
  product: ProductsEntity;

  @Column({ default: false })
  isPurchased: boolean;
}
