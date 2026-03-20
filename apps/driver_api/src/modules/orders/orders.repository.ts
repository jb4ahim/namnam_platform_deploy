import { Injectable } from '@nestjs/common';
import { order_status_type, PrismaService } from '@app/database';

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getAssignedOrders(driverId: number, status?: string) {
    return this.prisma.orders.findMany({
      where: {
        driver_id: driverId,
        ...(status ? { status: status as order_status_type } : {}),
      },
      orderBy: { created_at: 'desc' },
      select: {
        order_id: true,
        status: true,
        total_amount: true,
        payment_method: true,
        created_at: true,
        merchants: { select: { name: true, street: true, building: true, hotline_number: true } },
        user_addresses: { select: { address_line1: true, building: true, city: true } },
        order_items: {
          select: {
            quantity: true,
            unit_price: true,
            products: { select: { product_id: true, name: true } },
          },
        },
      },
    });
  }

  async getOrderById(driverId: number, orderId: number) {
    return this.prisma.orders.findFirst({
      where: { order_id: orderId, driver_id: driverId },
      select: {
        order_id: true,
        status: true,
        total_amount: true,
        payment_method: true,
        created_at: true,
        merchants: { select: { name: true, street: true, building: true, hotline_number: true, latitude: true, longitude: true } },
        user_addresses: { select: { address_line1: true, building: true, city: true, latitude: true, longitude: true } },
        order_items: {
          select: {
            quantity: true,
            unit_price: true,
            products: { select: { product_id: true, name: true } },
          },
        },
      },
    });
  }

  async updateOrderStatus(driverId: number, orderId: number, status: order_status_type) {
    return this.prisma.orders.updateMany({
      where: { order_id: orderId, driver_id: driverId },
      data: { status, updated_at: new Date() },
    });
  }

  async getAvailableOrders() {
    return this.prisma.orders.findMany({
      where: { status: 'ready_for_pickup', driver_id: null },
      orderBy: { created_at: 'asc' },
      select: {
        order_id: true,
        status: true,
        total_amount: true,
        payment_method: true,
        created_at: true,
        merchants: { select: { name: true, street: true, building: true, latitude: true, longitude: true } },
        user_addresses: { select: { address_line1: true, building: true, city: true, latitude: true, longitude: true } },
      },
    });
  }

  async acceptOrder(driverId: number, orderId: number) {
    return this.prisma.orders.updateMany({
      where: { order_id: orderId, driver_id: null, status: 'ready_for_pickup' },
      data: { driver_id: driverId, status: 'out_for_delivery', updated_at: new Date() },
    });
  }
}
