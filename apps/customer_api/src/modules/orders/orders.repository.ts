import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';

@Injectable()
export class OrdersRepository {
  constructor(private readonly pg: PostgresService) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    console.log('Creating order with DTO:', dto, 'and cartId:', cartId, 'and userId:', userId);
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'insert_customer_order',
      [
        userId,
        dto.merchant_id,
        dto.delivery_address_id,
        dto.cartId,
        dto.payment_method,
        dto.scheduled_for || null,
        dto.delivery_instructions || null,
      ],
      false
    );
    return result;
  }

  async listOrders(userId: number, status?: string, startDate?: string, endDate?: string) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_customer_orders',
      [userId, status || null, startDate || null, endDate || null],
      false
    );
    return result || [];
  }

  async getOrderDetails(userId: number, orderId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_order_details',
      [userId, orderId],
      false
    );
    return result;
  }

  async getOrderPaymentStatus(userId: number, orderId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_order_payment_status',
      [userId, orderId],
      false
    );
    return result;
  }

  async getOrderTracking(userId: number, orderId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_order_tracking',
      [userId, orderId],
      false
    );
    return result;
  }

  async cancelOrder(userId: number, orderId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'cancel_customer_order',
      [userId, orderId]
    );
    return { success: true, message: 'Order cancelled successfully' };
  }

  async updateDeliveryInstructions(userId: number, orderId: number, dto: UpdateDeliveryInstructionsDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_order_delivery_instructions',
      [userId, orderId, dto.delivery_instructions]
    );
    return { success: true, message: 'Delivery instructions updated' };
  }

  async requestRefund(userId: number, orderId: number, dto: RefundRequestDto) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'request_order_refund',
      [userId, orderId, dto.reason, dto.notes || null],
      false
    );
    return result;
  }
}
