import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { UpdateShippingDto } from './dto/update-shipping.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { CreateRefundDto } from './dto/create-refund.dto';
import { CreateOrderNoteDto } from './dto/create-note.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async listOrders(merchantId: number, status?: string, startDate?: string, endDate?: string) {
    return await this.repo.listOrders(merchantId, status, startDate, endDate);
  }

  async getOrderDetails(merchantId: number, orderId: number) {
    return await this.repo.getOrderDetails(merchantId, orderId);
  }

  async updateOrderStatus(merchantId: number, orderId: number, dto: UpdateOrderStatusDto) {
    await this.repo.updateOrderStatus(merchantId, orderId, dto);
    return { success: true };
  }

  async updateShipping(merchantId: number, orderId: number, dto: UpdateShippingDto) {
    await this.repo.updateShipping(merchantId, orderId, dto);
    return { success: true };
  }

  async cancelOrder(merchantId: number, orderId: number, dto: CancelOrderDto) {
    await this.repo.cancelOrder(merchantId, orderId, dto);
    return { success: true };
  }

  async createRefund(merchantId: number, orderId: number, dto: CreateRefundDto) {
    return await this.repo.createRefund(merchantId, orderId, dto);
  }

  async addOrderNote(merchantId: number, orderId: number, dto: CreateOrderNoteDto) {
    await this.repo.addOrderNote(merchantId, orderId, dto);
    return { success: true };
  }
}
