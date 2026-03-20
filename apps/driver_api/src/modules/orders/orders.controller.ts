import { Controller, Get, Patch, Post, Param, Body, Query, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { DriverOrderResponseDto } from './dto/orders-response.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Get my assigned orders' })
  @ApiQuery({ name: 'status', required: false, enum: ['confirmed', 'preparing', 'ready_for_pickup', 'out_for_delivery', 'delivered', 'cancelled'] })
  @ApiResponse({ status: 200, description: 'List of assigned orders.', type: [DriverOrderResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getMyOrders(@Request() req: any, @Query('status') status?: string) {
    return this.ordersService.getMyOrders(req.user.userId, status);
  }

  @Get('available')
  @ApiOperation({ summary: 'Get available orders ready for pickup' })
  @ApiResponse({ status: 200, description: 'List of unassigned ready orders.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getAvailable() {
    return this.ordersService.getAvailableOrders();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  @ApiResponse({ status: 200, description: 'Order details.', type: DriverOrderResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(req.user.userId, id);
  }

  @Post(':id/accept')
  @ApiOperation({ summary: 'Accept an available order' })
  @ApiResponse({ status: 201, description: 'Order accepted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 409, description: 'Order no longer available.' })
  async acceptOrder(@Request() req: any, @Param('id', ParseIntPipe) id: number) {
    await this.ordersService.acceptOrder(req.user.userId, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update delivery status of an assigned order' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async updateStatus(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    await this.ordersService.updateStatus(req.user.userId, id, dto);
  }
}
