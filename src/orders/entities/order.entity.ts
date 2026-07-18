import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Número sequencial simples pra referenciar o pedido com o cliente
  // (ex: exibido no admin como #00000001). Gerado automaticamente pelo
  // Postgres via sequence, independente do id (uuid).
  @Column({ type: 'int', generated: 'increment' })
  orderNumber: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalAmount: number;

  // Soma do custo dos itens (produtos sem custo cadastrado contam como 0
  // aqui, então o "líquido" pode ficar superestimado se faltar cadastrar
  // custo de algum produto)
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @Column({ type: 'timestamptz', nullable: true })
  confirmedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
