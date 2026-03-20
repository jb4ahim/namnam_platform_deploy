import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { order_status_type } from '@app/database';
import { OrdersRepository } from './orders.repository';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { DriverOrderResponseDto } from './dto/orders-response.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly repo: OrdersRepository) {}

  private mapOrder(o: any): DriverOrderResponseDto {
    return {
      orderId: o.order_id,
      status: o.status,
      createdAt: o.created_at?.toISOString(),
      merchantName: o.merchants?.name ?? '',
      merchantAddress: [o.merchants?.building, o.merchants?.street].filter(Boolean).join(', ') || undefined,
      merchantPhone: o.merchants?.hotline_number ?? undefined,
      deliveryAddress: [o.user_addresses?.building, o.user_addresses?.address_line1, o.user_addresses?.city].filter(Boolean).join(', ') || undefined,
      totalAmount: Number(o.total_amount),
      paymentMethod: o.payment_method ?? 'cash',
      items: (o.order_items ?? []).map((i: any) => ({
        productId: i.products?.product_id,
        productName: i.products?.name,
        quantity: i.quantity,
        unitPrice: Number(i.unit_price),
      })),
    };
  }

  async getMyOrders(driverId: number, status?: string) {
    const orders = await this.repo.getAssignedOrders(driverId, status);
    return orders.map(o => this.mapOrder(o));
  }

  async getOrderById(driverId: number, orderId: number) {
    const order = await this.repo.getOrderById(driverId, orderId);
    if (!order) throw new NotFoundException('Order not found');
    return this.mapOrder(order);
  }

  async updateStatus(driverId: number, orderId: number, dto: UpdateOrderStatusDto) {
    const result = await this.repo.updateOrderStatus(driverId, orderId, dto.status as order_status_type);
    if (result.count === 0) throw new NotFoundException('Order not found or not assigned to you');
  }

  async getAvailableOrders() {
    return this.repo.getAvailableOrders();
  }

  async acceptOrder(driverId: number, orderId: number) {
    const result = await this.repo.acceptOrder(driverId, orderId);
    if (result.count === 0) throw new ConflictException('Order no longer available');
  }
}
