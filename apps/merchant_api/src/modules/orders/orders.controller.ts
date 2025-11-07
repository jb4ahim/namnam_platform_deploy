import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth';
import { CurrentMerchantId, CurrentUserId } from '@app/common/decorators';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateRefundDto } from './dto/create-refund.dto';
import { CreateOrderNoteDto } from './dto/create-note.dto';

@Controller('merchant/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  async listOrders(
    @CurrentMerchantId() merchantId: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    // @Query('customerId', ParseIntPipe) customerId?: number,
  ) {
    return await this.ordersService.listOrders(merchantId, status, startDate, endDate);
  }

  @Get(':orderId')
  async getOrderDetails(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.ordersService.getOrderDetails(merchantId, orderId);
  }

  @Put(':orderId/status')
  async updateOrderStatus(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(merchantId, orderId, dto);
  }

  @Put(':orderId/shipping')
  async updateShipping(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateShippingDto,
  ) {
    return await this.ordersService.updateShipping(merchantId, orderId, dto);
  }

  @Put(':orderId/cancel')
  async cancelOrder(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CancelOrderDto,
  ) {
    return await this.ordersService.cancelOrder(merchantId, orderId, dto);
  }

  @Post(':orderId/refunds')
  async createRefund(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateRefundDto,
  ) {
    return await this.ordersService.createRefund(merchantId, orderId, dto);
  }

  @Post(':orderId/notes')
  async addOrderNote(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateOrderNoteDto,
  ) {
    return await this.ordersService.addOrderNote(merchantId, orderId, dto);
  }
}
