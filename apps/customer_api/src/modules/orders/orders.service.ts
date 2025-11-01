import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  async createOrder(userId: number, dto: CreateOrderDto) {
    return this.repo.createOrder(userId, dto);
  }

  async listOrders(userId: number, status?: string, startDate?: string, endDate?: string) {
    return this.repo.listOrders(userId, status, startDate, endDate);
  }

  async getOrderDetails(userId: number, orderId: number) {
    return this.repo.getOrderDetails(userId, orderId);
  }

  async getOrderPaymentStatus(userId: number, orderId: number) {
    return this.repo.getOrderPaymentStatus(userId, orderId);
  }

  async getOrderTracking(userId: number, orderId: number) {
    return this.repo.getOrderTracking(userId, orderId);
  }

  async cancelOrder(userId: number, orderId: number) {
    return this.repo.cancelOrder(userId, orderId);
  }

  async updateDeliveryInstructions(userId: number, orderId: number, dto: UpdateDeliveryInstructionsDto) {
    return this.repo.updateDeliveryInstructions(userId, orderId, dto);
  }

  async requestRefund(userId: number, orderId: number, dto: RefundRequestDto) {
    return this.repo.requestRefund(userId, orderId, dto);
  }
}
