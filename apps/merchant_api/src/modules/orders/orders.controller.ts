import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { CurrentMerchantId } from '@app/common/decorators';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateRefundDto } from './dto/create-refund.dto';
import { CreateOrderNoteDto } from './dto/create-note.dto';
import { OrderSummaryDto, OrderDetailDto } from './dto/order-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('merchant/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by order status', enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'delivered', 'cancelled'] })
  @ApiQuery({ name: 'startDate', required: false, description: 'Filter from date (ISO 8601)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Filter to date (ISO 8601)' })
  @ApiResponse({ status: 200, type: [OrderSummaryDto], description: 'List of orders' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listOrders(
    @CurrentMerchantId() merchantId: number,
    @Query('status') status?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return await this.ordersService.listOrders(merchantId, status, startDate, endDate);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 200, type: OrderDetailDto, description: 'Full order details with items, delivery and payment' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async getOrderDetails(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ) {
    return await this.ordersService.getOrderDetails(merchantId, orderId);
  }

  @Put(':orderId/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateOrderStatus(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateOrderStatus(merchantId, orderId, dto);
  }

  @Put(':orderId/shipping')
  @ApiOperation({ summary: 'Update shipping info' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 200, description: 'Shipping info updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateShipping(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: UpdateShippingDto,
  ) {
    return await this.ordersService.updateShipping(merchantId, orderId, dto);
  }

  @Put(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 200, description: 'Order cancelled' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async cancelOrder(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CancelOrderDto,
  ) {
    return await this.ordersService.cancelOrder(merchantId, orderId, dto);
  }

  @Post(':orderId/refunds')
  @ApiOperation({ summary: 'Create a refund for an order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 201, description: 'Refund created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRefund(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateRefundDto,
  ) {
    return await this.ordersService.createRefund(merchantId, orderId, dto);
  }

  @Post(':orderId/notes')
  @ApiOperation({ summary: 'Add a note to an order' })
  @ApiParam({ name: 'orderId', type: Number })
  @ApiResponse({ status: 201, description: 'Note added' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addOrderNote(
    @CurrentMerchantId() merchantId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() dto: CreateOrderNoteDto,
  ) {
    return await this.ordersService.addOrderNote(merchantId, orderId, dto);
  }
}
