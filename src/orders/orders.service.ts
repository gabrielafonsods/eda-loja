import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem, SaleType } from './entities/order-item.entity';
import {
  StockMovement,
  MovementType,
  MovementReason,
} from './entities/stock-movement.entity';
import { ProductVariant } from '../products/entities/product-variant.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestockDto } from './dto/restock.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(StockMovement)
    private readonly movementRepository: Repository<StockMovement>,
    @InjectRepository(ProductVariant)
    private readonly variantRepository: Repository<ProductVariant>,
    private readonly productsService: ProductsService,
  ) {}

  // Cria um pedido PENDENTE — chamado quando o cliente clica em
  // "Enviar pedido pelo WhatsApp" no site. Não mexe no estoque ainda.
  async create(dto: CreateOrderDto): Promise<Order> {
    const items: OrderItem[] = [];
    let total = 0;

    for (const line of dto.items) {
      const variant = await this.variantRepository.findOne({
        where: { id: line.productVariantId },
      relations: { product: true },
      });
      if (!variant) {
        throw new NotFoundException(
          `Variação ${line.productVariantId} não encontrada`,
        );
      }

      let unitsConsumed: number;
      let unitPrice: number;

      if (line.saleType === SaleType.FARDO) {
        if (!variant.fardoSize || !variant.fardoPrice) {
          throw new BadRequestException('Esse produto não é vendido em fardo');
        }
        unitsConsumed = variant.fardoSize * line.quantity;
        unitPrice = Number(variant.fardoPrice);
      } else {
        unitsConsumed = line.quantity;
        unitPrice = Number(variant.unitPrice);
      }

      const subtotal = unitPrice * line.quantity;
      total += subtotal;

      items.push(
        this.orderItemRepository.create({
          productVariantId: variant.id,
          productName: variant.product?.name || '',
          variantDescription: variant.attributes
            ? Object.values(variant.attributes).join(', ')
            : undefined,
          saleType: line.saleType,
          quantity: line.quantity,
          unitsConsumed,
          unitPriceAtSale: unitPrice,
          subtotal,
        }),
      );
    }

    const order = this.orderRepository.create({
      status: OrderStatus.PENDING,
      totalAmount: total,
      items,
    });

    return this.orderRepository.save(order);
  }

  findAll(status?: OrderStatus): Promise<Order[]> {
    return this.orderRepository.find({
      where: status ? { status } : {},
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Pedido ${id} não encontrado`);
    return order;
  }

  // Só o admin chama isso — confirma que virou venda de verdade
  // e É AQUI que o estoque desconta.
  async confirm(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Só é possível confirmar pedidos pendentes');
    }

    for (const item of order.items) {
      await this.productsService.adjustStock(
        item.productVariantId,
        -item.unitsConsumed,
      );
      await this.movementRepository.save(
        this.movementRepository.create({
          productVariantId: item.productVariantId,
          type: MovementType.OUT,
          reason: MovementReason.SALE,
          quantityUnits: item.unitsConsumed,
          relatedOrderId: order.id,
        }),
      );
    }

    order.status = OrderStatus.CONFIRMED;
    order.confirmedAt = new Date();
    return this.orderRepository.save(order);
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Só é possível cancelar pedidos pendentes');
    }
    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  // Entrada manual de estoque (chegou mercadoria nova do fornecedor)
  async restock(variantId: string, dto: RestockDto): Promise<ProductVariant> {
    const variant = await this.productsService.adjustStock(
      variantId,
      dto.quantityUnits,
    );
    await this.movementRepository.save(
      this.movementRepository.create({
        productVariantId: variantId,
        type: MovementType.IN,
        reason: MovementReason.RESTOCK,
        quantityUnits: dto.quantityUnits,
        note: dto.note,
      }),
    );
    return variant;
  }

  stockMovements(variantId?: string) {
    return this.movementRepository.find({
      where: variantId ? { productVariantId: variantId } : {},
      order: { createdAt: 'DESC' },
    });
  }

  // Relatório de vendas — diário, semanal, mensal ou anual
  async salesReport(period: 'day' | 'week' | 'month' | 'year') {
    const now = new Date();
    let from: Date;

    switch (period) {
      case 'day':
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        from = new Date(now);
        from.setDate(now.getDate() - 7);
        break;
      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        from = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.CONFIRMED })
      .andWhere('order.confirmedAt >= :from', { from })
      .getMany();

    const totalRevenue = orders.reduce(
      (sum, o) => sum + Number(o.totalAmount),
      0,
    );

    return {
      period,
      from,
      totalOrders: orders.length,
      totalRevenue,
    };
  }
}
