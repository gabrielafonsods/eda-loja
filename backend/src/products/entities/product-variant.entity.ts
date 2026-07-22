import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: string;

  // Estoque SEMPRE em unidades — mesmo que ela venda por fardo,
  // o fardo é só uma forma de vender várias unidades de uma vez.
  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  // Estoque mínimo (em unidades) para disparar alerta de reposição
  @Column({ type: 'int', default: 0 })
  minStock: number;

  // Preço vendendo uma unidade solta
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice: number;

  // Quanto custou comprar 1 unidade (do fornecedor) — usado pra calcular
  // lucro/faturamento líquido nos relatórios. Opcional: se não preencher,
  // o relatório trata o custo desse item como zero.
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice?: number;

  // Quantas unidades tem em 1 fardo. Deixe em branco se esse produto
  // não é vendido em fardo (só unidade solta).
  @Column({ type: 'int', nullable: true })
  fardoSize?: number;

  // Preço vendendo 1 fardo fechado
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  fardoPrice?: number;

  @Column({ nullable: true, unique: true })
  sku?: string;

  // Ex: { "Cor": "Azul", "Sabor": "Menta" }
  @Column({ type: 'jsonb', nullable: true, default: {} })
  attributes?: Record<string, string>;
}
