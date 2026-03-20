import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { AuthGuard } from '@app/auth';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

const mockReq = { user: { userId: 1 } };

const mockOrder = {
  orderId: 42,
  status: 'out_for_delivery',
  createdAt: '2024-06-01T12:00:00.000Z',
  merchantName: 'Burger House',
  merchantAddress: 'Hamra, Beirut',
  deliveryAddress: 'Verdun, Beirut',
  totalAmount: 35.5,
  paymentMethod: 'cash',
  items: [{ productId: 1, productName: 'Burger', quantity: 2, unitPrice: 15 }],
};

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: jest.Mocked<OrdersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            getMyOrders: jest.fn(),
            getOrderById: jest.fn(),
            updateStatus: jest.fn(),
            getAvailableOrders: jest.fn(),
            acceptOrder: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(OrdersController);
    service = module.get(OrdersService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getMyOrders', () => {
    it('returns list of assigned orders', async () => {
      service.getMyOrders.mockResolvedValueOnce([mockOrder]);

      const result = await controller.getMyOrders(mockReq, 'out_for_delivery');

      expect(service.getMyOrders).toHaveBeenCalledWith(1, 'out_for_delivery');
      expect(result).toEqual([mockOrder]);
    });

    it('returns all orders when status is omitted', async () => {
      service.getMyOrders.mockResolvedValueOnce([mockOrder]);

      await controller.getMyOrders(mockReq, undefined);

      expect(service.getMyOrders).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe('getAvailable', () => {
    it('returns available orders', async () => {
      service.getAvailableOrders.mockResolvedValueOnce([mockOrder] as any);

      const result = await controller.getAvailable();

      expect(service.getAvailableOrders).toHaveBeenCalled();
      expect(result).toEqual([mockOrder]);
    });
  });

  describe('getOrderById', () => {
    it('returns order details', async () => {
      service.getOrderById.mockResolvedValueOnce(mockOrder);

      const result = await controller.getOrderById(mockReq, 42);

      expect(service.getOrderById).toHaveBeenCalledWith(1, 42);
      expect(result).toEqual(mockOrder);
    });

    it('propagates NotFoundException from service', async () => {
      service.getOrderById.mockRejectedValueOnce(new NotFoundException('Order not found'));

      await expect(controller.getOrderById(mockReq, 999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('acceptOrder', () => {
    it('accepts available order', async () => {
      service.acceptOrder.mockResolvedValueOnce(undefined);

      await controller.acceptOrder(mockReq, 42);

      expect(service.acceptOrder).toHaveBeenCalledWith(1, 42);
    });

    it('propagates ConflictException when order not available', async () => {
      service.acceptOrder.mockRejectedValueOnce(new ConflictException('Order no longer available'));

      await expect(controller.acceptOrder(mockReq, 42)).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('updateStatus', () => {
    it('updates order status', async () => {
      const dto: UpdateOrderStatusDto = { status: 'delivered' };
      service.updateStatus.mockResolvedValueOnce(undefined);

      await controller.updateStatus(mockReq, 42, dto);

      expect(service.updateStatus).toHaveBeenCalledWith(1, 42, dto);
    });

    it('propagates NotFoundException when order not assigned to driver', async () => {
      const dto: UpdateOrderStatusDto = { status: 'delivered' };
      service.updateStatus.mockRejectedValueOnce(new NotFoundException('Order not found or not assigned to you'));

      await expect(controller.updateStatus(mockReq, 999, dto)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
