import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(dto);
    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    Object.assign(product, dto);
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }

  // Retorna variações com estoque (em unidades) abaixo do mínimo definido
  async lowStock(): Promise<ProductVariant[]> {
    return this.variantRepository
      .createQueryBuilder('variant')
      .leftJoinAndSelect('variant.product', 'product')
      .where('variant.stockQuantity <= variant.minStock')
      .getMany();
  }

  async findVariant(id: string): Promise<ProductVariant> {
    const variant = await this.variantRepository.findOne({ where: { id } });
    if (!variant) {
      throw new NotFoundException(`Variação ${id} não encontrada`);
    }
    return variant;
  }

  // Ajusta o estoque em unidades. deltaUnits negativo = saída, positivo = entrada.
  // Usado pelo módulo de Pedidos ao confirmar uma venda, e por ajustes manuais.
  async adjustStock(variantId: string, deltaUnits: number): Promise<ProductVariant> {
    const variant = await this.findVariant(variantId);
    const newQuantity = variant.stockQuantity + deltaUnits;

    if (newQuantity < 0) {
      throw new BadRequestException(
        `Estoque insuficiente: tem ${variant.stockQuantity} unidade(s), tentando tirar ${-deltaUnits}`,
      );
    }

    variant.stockQuantity = newQuantity;
    return this.variantRepository.save(variant);
  }
}
