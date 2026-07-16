import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

export enum UnitType {
  UNIT = 'unit', // unidade avulsa
  PACK = 'pack', // pacote (ex: pacote com 50 copos)
  BOX = 'box', // caixa fechada (ex: caixa com 20 pacotes)
}

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

  @Column({ type: 'enum', enum: UnitType, default: UnitType.UNIT })
  unitType: UnitType;

  // Quantidade contida nessa variação (ex: 50 para "pacote com 50")
  @Column({ type: 'int', default: 1 })
  quantityPerUnit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stockQuantity: number;

  // Estoque mínimo para disparar alerta de reposição
  @Column({ type: 'int', default: 0 })
  minStock: number;

  @Column({ nullable: true, unique: true })
  sku?: string;

  // Atributos flexíveis da variação, ex: { "Cor": "Azul", "Número": "5", "Sabor": "Menta" }
  // Isso permite representar qualquer tipo de variação do catálogo (cores, tamanhos, sabores)
  // sem precisar mudar a estrutura do banco quando novos tipos de atributo aparecerem.
  @Column({ type: 'jsonb', nullable: true, default: {} })
  attributes?: Record<string, string>;
}
