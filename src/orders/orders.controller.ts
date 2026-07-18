import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RestockDto } from './dto/restock.dto';
import { OrderStatus } from './entities/order.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Rota PÚBLICA — o site chama isso ao enviar o pedido pelo WhatsApp
  @Post('orders')
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  // Tudo abaixo é ADMINISTRATIVO — exige login (eda-admin)
  @UseGuards(JwtAuthGuard)
  @Get('orders')
  findAll(@Query('status') status?: OrderStatus) {
    return this.ordersService.findAll(status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('orders/:id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('orders/:id/confirm')
  confirm(@Param('id') id: string) {
    return this.ordersService.confirm(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('orders/:id/cancel')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(id);
  }

  // Apaga o pedido, independente do status (inclusive confirmados)
  @UseGuards(JwtAuthGuard)
  @Delete('orders/:id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('stock/:variantId/restock')
  restock(@Param('variantId') variantId: string, @Body() dto: RestockDto) {
    return this.ordersService.restock(variantId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('stock/movements')
  movements(@Query('variantId') variantId?: string) {
    return this.ordersService.stockMovements(variantId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reports/sales')
  salesReport(
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'day',
  ) {
    return this.ordersService.salesReport(period);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reports/sales/monthly')
  monthlyBreakdown(@Query('year') year?: string) {
    const y = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.ordersService.monthlyBreakdown(y);
  }
}
