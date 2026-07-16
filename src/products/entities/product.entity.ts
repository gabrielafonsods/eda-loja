import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ nullable: true })
  supplier?: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => ProductVariant, (variant) => variant.product, {
    cascade: true,
    eager: true,
  })
  variants: ProductVariant[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
