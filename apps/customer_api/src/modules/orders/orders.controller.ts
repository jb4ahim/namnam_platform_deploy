import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully.' })
  async createOrder(
    @CurrentUserId() userId: number,
    @Body() dto: CreateOrderDto
  ) {
    return await this.ordersService.createOrder(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List user orders' })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Return paginated orders.' })
  async listOrders(
    @CurrentUserId() userId: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.ordersService.listOrders(userId, status, startDate, endDate);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Return order details.' })
  async getOrderDetails(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.ordersService.getOrderDetails(userId, orderId);
  }

  @Get(':orderId/payment')
  @ApiOperation({ summary: 'Get order payment status' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Return payment status.' })
  async getOrderPaymentStatus(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.getOrderPaymentStatus(userId, orderId);
  }

  @Get(':orderId/tracking')
  @ApiOperation({ summary: 'Get order tracking info' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Return tracking details.' })
  async getOrderTracking(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.getOrderTracking(userId, orderId);
  }

  @Put(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order cancelled successfully.' })
  async cancelOrder(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number
  ) {
    return await this.ordersService.cancelOrder(userId, orderId);
  }

  @Put(':orderId/delivery')
  @ApiOperation({ summary: 'Update delivery instructions' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Instructions updated successfully.' })
  async updateDeliveryInstructions(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateDeliveryInstructionsDto
  ) {
    return await this.ordersService.updateDeliveryInstructions(userId, orderId, dto);
  }

  @Post(':orderId/refund')
  @ApiOperation({ summary: 'Request an order refund' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 201, description: 'Refund requested successfully.' })
  async requestRefund(
    @CurrentUserId() userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: RefundRequestDto
  ) {
    return await this.ordersService.requestRefund(userId, orderId, dto);
  }
}
