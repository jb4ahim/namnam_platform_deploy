import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateRefundDto } from './dto/create-refund.dto';
import { CreateOrderNoteDto } from './dto/create-note.dto';
import { stat } from 'fs';

@Injectable()
export class OrdersRepository {
  constructor(private readonly pg: PostgresService) {}

  async listOrders(merchantId: number, status?: string, startDate?: string, endDate?: string) {
    if(status == "" || startDate == "" || endDate == ""){
      status = null;
      startDate = null;
      endDate = null;

    }
    console.log('Listing orders for merchant:', merchantId, status, startDate, endDate);
    return await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_orders',
      [merchantId, status ?? null, startDate ?? null, endDate ?? null,  null],
      false
    );
  }

  async getOrderDetails(merchantId: number, orderId: number) {
    return await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_order_details',
      [merchantId, orderId],
      false
    );
  }

  async updateOrderStatus(merchantId: number, orderId: number, dto: UpdateOrderStatusDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_order_status_merchant',
      [merchantId, orderId, dto.status]
    );
  }

  async updateShipping(merchantId: number, orderId: number, dto: UpdateShippingDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_order_shipping_merchant',
      [merchantId, orderId, dto.carrier, dto.trackingNumber, dto.shippedAt ?? null]
    );
  }

  async cancelOrder(merchantId: number, orderId: number, dto: CancelOrderDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'cancel_order_merchant',
      [merchantId, orderId, dto.reason ?? null]
    );
  }

  async createRefund(merchantId: number, orderId: number, dto: CreateRefundDto) {
    return await DatabaseUtils.callFunction(
      this.pg,
      'create_order_refund_merchant',
      [merchantId, orderId, dto.amount, dto.reason, dto.notes ?? null],
      false
    );
  }

  async addOrderNote(merchantId: number, orderId: number, dto: CreateOrderNoteDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'add_order_note_merchant',
      [merchantId, orderId, dto.message, dto.visibility ?? 'internal']
    );
  }
}
