import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum MovementType {
  IN = 'in',
  OUT = 'out',
}

export enum MovementReason {
  SALE = 'sale',
  RESTOCK = 'restock',
  ADJUSTMENT = 'adjustment',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productVariantId: string;

  @Column({ type: 'enum', enum: MovementType })
  type: MovementType;

  @Column({ type: 'enum', enum: MovementReason })
  reason: MovementReason;

  @Column({ type: 'int' })
  quantityUnits: number;

  @Column({ nullable: true })
  relatedOrderId?: string;

  @Column({ nullable: true })
  note?: string;

  @CreateDateColumn()
  createdAt: Date;
}
