import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const mockDbOrder = {
  order_id: 42,
  status: 'out_for_delivery',
  total_amount: '35.50',
  payment_method: 'cash',
  created_at: new Date('2024-06-01T12:00:00.000Z'),
  merchants: { name: 'Burger House', street: 'Hamra', building: '10', hotline_number: '+96170000000' },
  user_addresses: { address_line1: 'Verdun St', building: '5', city: 'Beirut' },
  order_items: [
    {
      quantity: 2,
      unit_price: '15.00',
      products: { product_id: 1, name: 'Burger' },
    },
  ],
};

const mockOrdersRepository = {
  getAssignedOrders: jest.fn(),
  getOrderById: jest.fn(),
  updateOrderStatus: jest.fn(),
  getAvailableOrders: jest.fn(),
  acceptOrder: jest.fn(),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let repo: jest.Mocked<OrdersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: OrdersRepository, useValue: mockOrdersRepository },
      ],
    }).compile();

    service = module.get(OrdersService);
    repo = module.get(OrdersRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMyOrders', () => {
    it('returns mapped orders list', async () => {
      repo.getAssignedOrders.mockResolvedValueOnce([mockDbOrder] as any);

      const result = await service.getMyOrders(1, 'out_for_delivery');

      expect(repo.getAssignedOrders).toHaveBeenCalledWith(1, 'out_for_delivery');
      expect(result).toHaveLength(1);
      expect(result[0].orderId).toBe(42);
      expect(result[0].totalAmount).toBe(35.5);
      expect(result[0].items[0].productName).toBe('Burger');
    });

    it('returns empty array when no orders assigned', async () => {
      repo.getAssignedOrders.mockResolvedValueOnce([]);

      const result = await service.getMyOrders(1);

      expect(result).toEqual([]);
    });
  });

  describe('getOrderById', () => {
    it('returns mapped order details', async () => {
      repo.getOrderById.mockResolvedValueOnce(mockDbOrder as any);

      const result = await service.getOrderById(1, 42);

      expect(repo.getOrderById).toHaveBeenCalledWith(1, 42);
      expect(result.orderId).toBe(42);
      expect(result.merchantName).toBe('Burger House');
    });

    it('throws NotFoundException when order not found', async () => {
      repo.getOrderById.mockResolvedValueOnce(null);

      await expect(service.getOrderById(1, 999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('updates order status successfully', async () => {
      repo.updateOrderStatus.mockResolvedValueOnce({ count: 1 } as any);
      const dto: UpdateOrderStatusDto = { status: 'delivered' };

      await expect(service.updateStatus(1, 42, dto)).resolves.toBeUndefined();
      expect(repo.updateOrderStatus).toHaveBeenCalledWith(1, 42, 'delivered');
    });

    it('throws NotFoundException when order not assigned to driver', async () => {
      repo.updateOrderStatus.mockResolvedValueOnce({ count: 0 } as any);
      const dto: UpdateOrderStatusDto = { status: 'delivered' };

      await expect(service.updateStatus(1, 999, dto)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('acceptOrder', () => {
    it('accepts available order', async () => {
      repo.acceptOrder.mockResolvedValueOnce({ count: 1 } as any);

      await expect(service.acceptOrder(1, 42)).resolves.toBeUndefined();
      expect(repo.acceptOrder).toHaveBeenCalledWith(1, 42);
    });

    it('throws ConflictException when order already taken', async () => {
      repo.acceptOrder.mockResolvedValueOnce({ count: 0 } as any);

      await expect(service.acceptOrder(1, 42)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('getAvailableOrders', () => {
    it('delegates to repository', async () => {
      repo.getAvailableOrders.mockResolvedValueOnce([mockDbOrder] as any);

      const result = await service.getAvailableOrders();

      expect(repo.getAvailableOrders).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });
});
