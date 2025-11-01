import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateDeliveryInstructionsDto } from './dto/update-delivery-instructions.dto';
import { RefundRequestDto } from './dto/refund-request.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
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
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const userId = 1;
      const createOrderDto: CreateOrderDto = {
        merchant_id: 1,
        delivery_address_id: 1,
        items: [
          { product_id: 1, quantity: 2, notes: 'No onions' },
          { product_id: 2, quantity: 1, notes: '' },
        ],
        payment_method: 'credit_card',
        scheduled_for: null,
        delivery_instructions: 'Ring doorbell twice',
      };
      const mockOrder = {
        order_id: 101,
        customer_id: userId,
        total_amount: 125.5,
        status: 'pending',
      };

      mockOrdersService.createOrder.mockResolvedValue(mockOrder);

      const result = await controller.createOrder(userId, createOrderDto);

      expect(service.createOrder).toHaveBeenCalledWith(userId, createOrderDto);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('listOrders', () => {
    it('should return list of orders for user', async () => {
      const userId = 1;
      const mockOrders = [
        {
          order_id: 101,
          merchant_id: 1,
          total_amount: 125.5,
          status: 'pending',
          created_at: new Date(),
        },
        {
          order_id: 100,
          merchant_id: 2,
          total_amount: 89.99,
          status: 'delivered',
          created_at: new Date(),
        },
      ];

      mockOrdersService.listOrders.mockResolvedValue(mockOrders);

      const result = await controller.listOrders(userId);

      expect(service.listOrders).toHaveBeenCalledWith(userId, undefined, undefined, undefined);
      expect(result).toEqual(mockOrders);
    });

    it('should filter orders by status', async () => {
      const userId = 1;
      const status = 'pending';
      const mockOrders = [
        { order_id: 101, status: 'pending' },
      ];

      mockOrdersService.listOrders.mockResolvedValue(mockOrders);

      await controller.listOrders(userId, status);

      expect(service.listOrders).toHaveBeenCalledWith(userId, status, undefined, undefined);
    });
  });

  describe('getOrderDetails', () => {
    it('should return order details', async () => {
      const userId = 1;
      const orderId = 101;
      const mockOrderDetails = {
        order_id: 101,
        customer_id: userId,
        merchant_id: 1,
        total_amount: 125.5,
        status: 'pending',
        items: [
          { order_item_id: 201, product_id: 1, quantity: 2, unit_price: 50.0 },
        ],
        delivery: {
          address_line1: '123 Main St',
          city: 'Cairo',
          latitude: 30.0444,
          longitude: 31.2357,
        },
      };

      mockOrdersService.getOrderDetails.mockResolvedValue(mockOrderDetails);

      const result = await controller.getOrderDetails(userId, orderId);

      expect(service.getOrderDetails).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockOrderDetails);
    });
  });

  describe('getOrderPaymentStatus', () => {
    it('should return payment status', async () => {
      const userId = 1;
      const orderId = 101;
      const mockPayment = {
        order_id: 101,
        payment_id: 501,
        amount: 125.5,
        status: 'completed',
        payment_method: 'credit_card',
        transaction_id: 'TXN-2025-10-13-001',
      };

      mockOrdersService.getOrderPaymentStatus.mockResolvedValue(mockPayment);

      const result = await controller.getOrderPaymentStatus(userId, orderId);

      expect(service.getOrderPaymentStatus).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('getOrderTracking', () => {
    it('should return order tracking information', async () => {
      const userId = 1;
      const orderId = 101;
      const mockTracking = {
        order_id: 101,
        status: 'in_transit',
        delivery_address: {
          city: 'Cairo',
          latitude: 30.0444,
          longitude: 31.2357,
        },
        updated_at: new Date(),
      };

      mockOrdersService.getOrderTracking.mockResolvedValue(mockTracking);

      const result = await controller.getOrderTracking(userId, orderId);

      expect(service.getOrderTracking).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockTracking);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order', async () => {
      const userId = 1;
      const orderId = 101;
      const mockResponse = { success: true, message: 'Order cancelled successfully' };

      mockOrdersService.cancelOrder.mockResolvedValue(mockResponse);

      const result = await controller.cancelOrder(userId, orderId);

      expect(service.cancelOrder).toHaveBeenCalledWith(userId, orderId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateDeliveryInstructions', () => {
    it('should update delivery instructions', async () => {
      const userId = 1;
      const orderId = 101;
      const updateDto: UpdateDeliveryInstructionsDto = {
        delivery_instructions: 'Please leave at front door',
      };
      const mockResponse = { success: true, message: 'Delivery instructions updated' };

      mockOrdersService.updateDeliveryInstructions.mockResolvedValue(mockResponse);

      const result = await controller.updateDeliveryInstructions(userId, orderId, updateDto);

      expect(service.updateDeliveryInstructions).toHaveBeenCalledWith(
        userId,
        orderId,
        updateDto
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('requestRefund', () => {
    it('should request refund for order', async () => {
      const userId = 1;
      const orderId = 101;
      const refundDto: RefundRequestDto = {
        reason: 'Order arrived damaged',
        notes: 'Several items were broken',
      };
      const mockResponse = {
        success: true,
        message: 'Refund request submitted',
        order_id: orderId,
        refund_status: 'pending',
      };

      mockOrdersService.requestRefund.mockResolvedValue(mockResponse);

      const result = await controller.requestRefund(userId, orderId, refundDto);

      expect(service.requestRefund).toHaveBeenCalledWith(userId, orderId, refundDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
