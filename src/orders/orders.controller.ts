import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestockDto } from './dto/restock.dto';
import { OrderStatus } from './entities/order.entity';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('orders')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get('orders')
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @Get('orders/:id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch('orders/:id/confirm')
  confirm(@Param('id') id: string) {
    return this.ordersService.confirm(id);
  }

  @Patch('orders/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  @Post('stock/:variantId/restock')
  restock(@Param('variantId') variantId: string, @Body() dto: RestockDto) {
    return this.ordersService.restock(variantId, dto);
  }

  @Get('stock/movements')
  movements(@Query('variantId') variantId?: string) {
    return this.ordersService.stockMovements(variantId);
  }

  @Get('reports/sales')
  salesReport(
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'day',
  ) {
    return this.ordersService.salesReport(period);
  }
}
