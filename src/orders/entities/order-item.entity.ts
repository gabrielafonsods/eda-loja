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

  // "Fotografia" do produto no momento da venda — assim o relatório
  // continua certo mesmo se o produto for editado ou apagado depois
  @Column()
  productName: string;

  @Column({ nullable: true })
  variantDescription?: string;

  @Column({ type: 'enum', enum: SaleType })
  saleType: SaleType;

  // Quantidade vendida na unidade de venda (ex: "2" fardos, ou "5" unidades soltas)
  @Column({ type: 'int' })
  quantity: number;

  // Quanto isso representa de verdade no estoque em unidades
  // (ex: 2 fardos de 50 unidades = 100)
  @Column({ type: 'int' })
  unitsConsumed: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPriceAtSale: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}
