import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Category, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column({ nullable: true })
  categoryId?: string;

  @Column({ nullable: true })
  supplier?: string;

  // URL da foto principal do produto (upload de arquivo fica pra depois —
  // por enquanto, cole o link de uma imagem já hospedada em algum lugar)
  @Column({ nullable: true })
  imageUrl?: string;

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
