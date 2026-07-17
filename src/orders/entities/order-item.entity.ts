import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum SaleType {
  UNIT = 'unit',
  FARDO = 'fardo',
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  orderId: string;

  @Column()
  productVariantId: string;

  @Column()
  productName: string;

  @Column({ nullable: true })
  variantDescription?: string;

  @Column({ type: 'enum', enum: SaleType })
  saleType: SaleType;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  unitsConsumed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPriceAtSale: number;

  // Custo por unidade no momento da venda (fotografia do costPrice do
  // produto). Fica em branco se o produto não tinha custo cadastrado.
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPriceAtSale?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
