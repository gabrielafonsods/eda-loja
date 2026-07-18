import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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

  async create(dto: CreateOrderDto): Promise<Order> {
    const items: OrderItem[] = [];
    const reserved: { variantId: string; units: number }[] = [];
    let total = 0;
    let totalCost = 0;

    try {
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

        // Reserva o estoque na hora, mesmo o pedido ficando pendente —
        // impede que um único pedido peça mais do que existe (adjustStock
        // já lança erro se ficaria negativo) e reduz a janela em que dois
        // pedidos simultâneos poderiam juntos estourar o estoque.
        await this.productsService.adjustStock(variant.id, -unitsConsumed);
        reserved.push({ variantId: variant.id, units: unitsConsumed });

        const subtotal = unitPrice * line.quantity;
        total += subtotal;

        // Custo (opcional) — se o produto não tem costPrice cadastrado,
        // conta como 0 nesse pedido (o líquido fica superestimado nesse caso)
        const costPriceAtSale =
          variant.costPrice != null ? Number(variant.costPrice) : undefined;
        const itemCost = costPriceAtSale != null ? costPriceAtSale * unitsConsumed : 0;
        totalCost += itemCost;

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
            costPriceAtSale,
            subtotal,
          }),
        );
      }
    } catch (err) {
      // Algo falhou no meio do pedido (produto inexistente, estoque
      // insuficiente, etc.) — devolve o que já tinha sido reservado antes
      // de propagar o erro pro cliente.
      for (const r of reserved) {
        await this.productsService.adjustStock(r.variantId, r.units);
      }
      throw err;
    }

    const order = this.orderRepository.create({
      status: OrderStatus.PENDING,
      totalAmount: total,
      totalCost,
      items,
    });

    const savedOrder = await this.orderRepository.save(order);

    for (const item of savedOrder.items) {
      await this.movementRepository.save(
        this.movementRepository.create({
          productVariantId: item.productVariantId,
          type: MovementType.OUT,
          reason: MovementReason.SALE,
          quantityUnits: item.unitsConsumed,
          relatedOrderId: savedOrder.id,
        }),
      );
    }

    return savedOrder;
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

  async confirm(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Só é possível confirmar pedidos pendentes');
    }

    // O estoque já foi reservado na criação do pedido — confirmar só
    // consolida o status, sem mexer no estoque de novo.
    order.status = OrderStatus.CONFIRMED;
    order.confirmedAt = new Date();
    return this.orderRepository.save(order);
  }

  async cancel(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Só é possível cancelar pedidos pendentes');
    }

    await this.restoreStock(order, 'Estoque devolvido — pedido cancelado');

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  // Apaga o pedido de qualquer status, incluindo confirmados. Atenção:
  // apagar um confirmado remove esse valor dos relatórios de vendas também.
  // Se o pedido ainda tinha estoque reservado/descontado por causa dele
  // (ou seja, não foi cancelado antes), devolve o estoque antes de apagar.
  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    if (order.status !== OrderStatus.CANCELLED) {
      await this.restoreStock(order, 'Estoque devolvido — pedido apagado');
    }
    await this.orderRepository.remove(order);
  }

  private async restoreStock(order: Order, note: string): Promise<void> {
    for (const item of order.items) {
      await this.productsService.adjustStock(
        item.productVariantId,
        item.unitsConsumed,
      );
      await this.movementRepository.save(
        this.movementRepository.create({
          productVariantId: item.productVariantId,
          type: MovementType.IN,
          reason: MovementReason.ADJUSTMENT,
          quantityUnits: item.unitsConsumed,
          relatedOrderId: order.id,
          note,
        }),
      );
    }
  }

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

  // Enriquecido com nome do produto/variação — sem isso, a tela só
  // teria o UUID da variação pra mostrar, o que não ajuda ninguém.
  async stockMovements(variantId?: string) {
    const movements = await this.movementRepository.find({
      where: variantId ? { productVariantId: variantId } : {},
      order: { createdAt: 'DESC' },
    });

    const variantIds = [...new Set(movements.map((m) => m.productVariantId))];
    const variants = variantIds.length
      ? await this.variantRepository.find({
          where: { id: In(variantIds) },
          relations: { product: true },
        })
      : [];
    const variantMap = new Map(variants.map((v) => [v.id, v]));

    return movements.map((m) => {
      const variant = variantMap.get(m.productVariantId);
      return {
        ...m,
        productName: variant?.product?.name ?? '(produto removido)',
        variantDescription: variant?.attributes
          ? Object.values(variant.attributes).join(', ')
          : undefined,
      };
    });
  }

  private periodStart(period: 'day' | 'week' | 'month' | 'year'): Date {
    const now = new Date();
    switch (period) {
      case 'day':
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
      case 'week': {
        const d = new Date(now);
        d.setDate(now.getDate() - 7);
        return d;
      }
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
    }
  }

  // Relatório de vendas — bruto, custo e líquido, por período
  async salesReport(period: 'day' | 'week' | 'month' | 'year') {
    const from = this.periodStart(period);

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.CONFIRMED })
      .andWhere('order.confirmedAt >= :from', { from })
      .getMany();

    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
    const totalCost = orders.reduce((sum, o) => sum + Number(o.totalCost), 0);

    return {
      period,
      from,
      totalOrders: orders.length,
      totalRevenue, // faturamento bruto
      totalCost,
      netRevenue: totalRevenue - totalCost, // faturamento líquido
    };
  }

  // Detalhamento mês a mês de um ano inteiro — útil pra levar pro contador
  // na hora do Imposto de Renda
  async monthlyBreakdown(year: number) {
    const from = new Date(year, 0, 1);
    const to = new Date(year + 1, 0, 1);

    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .where('order.status = :status', { status: OrderStatus.CONFIRMED })
      .andWhere('order.confirmedAt >= :from', { from })
      .andWhere('order.confirmedAt < :to', { to })
      .getMany();

    const months = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      totalOrders: 0,
      totalRevenue: 0,
      totalCost: 0,
      netRevenue: 0,
    }));

    for (const order of orders) {
      const monthIndex = new Date(order.confirmedAt!).getMonth();
      months[monthIndex].totalOrders += 1;
      months[monthIndex].totalRevenue += Number(order.totalAmount);
      months[monthIndex].totalCost += Number(order.totalCost);
    }

    for (const m of months) {
      m.netRevenue = m.totalRevenue - m.totalCost;
    }

    return { year, months };
  }
}
