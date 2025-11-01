import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: OrdersRepository;

  const mockOrdersRepository = {
    createOrder: jest.fn(),
    listOrders: jest.fn(),
    getOrderDetails: jest.fn(),
    getOrderPaymentStatus: jest.fn(),
    getOrderTracking: jest.fn(),
    cancelOrder: jest.fn(),
    updateDeliveryInstructions: jest.fn(),
    requestRefund: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: mockOrdersRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<OrdersRepository>(OrdersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order through repository', async () => {
      const userId = 1;
      const createOrderDto: CreateOrderDto = {
        merchant_id: 1,
        delivery_address_id: 1,
        items: [
          { product_id: 1, quantity: 2, notes: 'No onions' },
        ],
        payment_method: 'credit_card',
        scheduled_for: null,
        delivery_instructions: 'Ring doorbell',
      };
      const mockOrder = {
        order_id: 101,
        customer_id: userId,
        total_amount: 125.5,
        status: 'pending',
      };

      mockOrdersRepository.createOrder.mockResolvedValue(mockOrder);

      const result = await service.createOrder(userId, createOrderDto);

      expect(repository.createOrder).toHaveBeenCalledWith(userId, createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('listOrders', () => {
    it('should list all orders for user', async () => {
      const userId = 1;
      const mockOrders = [
        { order_id: 101, status: 'pending' },
        { order_id: 100, status: 'delivered' },
      ];

      mockOrdersRepository.listOrders.mockResolvedValue(mockOrders);

      const result = await service.listOrders(userId);

      expect(repository.listOrders).toHaveBeenCalledWith(userId, undefined, undefined, undefined);
      expect(result).toEqual(mockOrders);
    });

    it('should filter orders by status and date range', async () => {
      const userId = 1;
      const status = 'pending';
      const startDate = '2025-01-01';
      const endDate = '2025-12-31';

      await service.listOrders(userId, status, startDate, endDate);

      expect(repository.listOrders).toHaveBeenCalledWith(
        userId,
        status,
        startDate,
        endDate
      );
    });
  });

  describe('getOrderDetails', () => {
    it('should get order details', async () => {
      const userId = 1;
      const orderId = 101;
      const mockDetails = { order_id: orderId, customer_id: userId };

      mockOrdersRepository.getOrderDetails.mockResolvedValue(mockDetails);

      const result = await service.getOrderDetails(userId, orderId);

      expect(repository.getOrderDetails).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockDetails);
    });
  });

  describe('getOrderPaymentStatus', () => {
    it('should get payment status', async () => {
      const userId = 1;
      const orderId = 101;
      const mockPayment = { order_id: orderId, status: 'completed' };

      mockOrdersRepository.getOrderPaymentStatus.mockResolvedValue(mockPayment);

      const result = await service.getOrderPaymentStatus(userId, orderId);

      expect(repository.getOrderPaymentStatus).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order', async () => {
      const userId = 1;
      const orderId = 101;
      const mockResponse = { success: true, message: 'Order cancelled successfully' };

      mockOrdersRepository.cancelOrder.mockResolvedValue(mockResponse);

      const result = await service.cancelOrder(userId, orderId);

      expect(repository.cancelOrder).toHaveBeenCalledWith(userId, orderId);
      expect(result.success).toBe(true);
    });
  });

  describe('updateDeliveryInstructions', () => {
    it('should update delivery instructions', async () => {
      const userId = 1;
      const orderId = 101;
      const updateDto: UpdateDeliveryInstructionsDto = {
        delivery_instructions: 'Leave at front door',
      };
      const mockResponse = { success: true, message: 'Delivery instructions updated' };

      mockOrdersRepository.updateDeliveryInstructions.mockResolvedValue(mockResponse);

      const result = await service.updateDeliveryInstructions(userId, orderId, updateDto);

      expect(repository.updateDeliveryInstructions).toHaveBeenCalledWith(
        userId,
        orderId,
        updateDto
      );
      expect(result.success).toBe(true);
    });
  });

  describe('requestRefund', () => {
    it('should request refund', async () => {
      const userId = 1;
      const orderId = 101;
      const refundDto: RefundRequestDto = {
        reason: 'Damaged',
        notes: 'Broken items',
      };
      const mockResponse = { success: true, refund_status: 'pending' };

      mockOrdersRepository.requestRefund.mockResolvedValue(mockResponse);

      const result = await service.requestRefund(userId, orderId, refundDto);

      expect(repository.requestRefund).toHaveBeenCalledWith(userId, orderId, refundDto);
      expect(result.success).toBe(true);
    });
  });
});
