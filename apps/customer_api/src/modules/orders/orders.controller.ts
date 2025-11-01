import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@CurrentUserId() userId: number, @Body() dto: CreateOrderDto) {
    return await this.ordersService.createOrder(userId, dto);
  }

  @Get()
  async listOrders(
    @CurrentUserId() userId: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ) {
    return await this.ordersService.listOrders(userId, status, startDate, endDate);
  }

  @Get(':orderId')
  async getOrderDetails(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.getOrderDetails(userId, orderId);
  }

  @Get(':orderId/payment')
  async getOrderPaymentStatus(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.getOrderPaymentStatus(userId, orderId);
  }

  @Get(':orderId/tracking')
  async getOrderTracking(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.getOrderTracking(userId, orderId);
  }

  @Put(':orderId/cancel')
  async cancelOrder(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.cancelOrder(userId, orderId);
  }

  @Put(':orderId/delivery')
  async updateDeliveryInstructions(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryInstructionsDto
  ) {
    return await this.ordersService.updateDeliveryInstructions(userId, orderId, dto);
  }

  @Post(':orderId/refund')
  async requestRefund(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: RefundRequestDto
  ) {
    return await this.ordersService.requestRefund(userId, orderId, dto);
  }
}
