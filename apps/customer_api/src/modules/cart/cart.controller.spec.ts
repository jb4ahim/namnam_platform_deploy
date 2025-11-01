import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  const mockCartService = {
    getCart: jest.fn(),
    getCartSummary: jest.fn(),
    getCartItem: jest.fn(),
    addItem: jest.fn(),
    updateItem: jest.fn(),
    bulkUpdateItems: jest.fn(),
    removeItem: jest.fn(),
    clearCart: jest.fn(),
    mergeGuestCart: jest.fn(),
    applyCoupon: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should return cart items for a user', async () => {
      const userId = 1;
      const mockCart = {
        cart_id: 1,
        customer_id: userId,
        items: [
          { cart_item_id: 1, product_id: 10, quantity: 2 },
        ],
        created_at: new Date(),
      };

      mockCartService.getCart.mockResolvedValue(mockCart);

      const result = await controller.getCart(userId);

      expect(service.getCart).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCart);
    });
  });

  describe('getCartSummary', () => {
    it('should return cart summary with totals', async () => {
      const userId = 1;
      const mockSummary = {
        total_items: 3,
        total_price: 150.0,
        discount_applied: true,
        discount_amount: 15.0,
        final_total: 135.0,
      };

      mockCartService.getCartSummary.mockResolvedValue(mockSummary);

      const result = await controller.getCartSummary(userId);

      expect(service.getCartSummary).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockSummary);
    });
  });

  describe('getCartItem', () => {
    it('should return a specific cart item', async () => {
      const userId = 1;
      const itemId = 1;
      const mockItem = {
        cart_item_id: 1,
        product_id: 10,
        quantity: 2,
      };

      mockCartService.getCartItem.mockResolvedValue(mockItem);

      const result = await controller.getCartItem(userId, itemId);

      expect(service.getCartItem).toHaveBeenCalledWith(userId, itemId);
      expect(result).toEqual(mockItem);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const userId = 1;
      const addItemDto: AddItemDto = {
        product_id: 10,
        quantity: 2,
      };
      const mockResponse = { success: true, message: 'Item added to cart' };

      mockCartService.addItem.mockResolvedValue(mockResponse);

      const result = await controller.addItem(userId, addItemDto);

      expect(service.addItem).toHaveBeenCalledWith(userId, addItemDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateItem', () => {
    it('should update cart item quantity', async () => {
      const userId = 1;
      const itemId = 1;
      const updateItemDto: UpdateItemDto = { quantity: 5 };
      const mockResponse = { success: true, message: 'Cart item updated' };

      mockCartService.updateItem.mockResolvedValue(mockResponse);

      const result = await controller.updateItem(userId, itemId, updateItemDto);

      expect(service.updateItem).toHaveBeenCalledWith(userId, itemId, updateItemDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('bulkUpdateItems', () => {
    it('should update multiple cart items', async () => {
      const userId = 1;
      const bulkUpdateDto: BulkUpdateItemsDto = {
        items: [
          { cart_item_id: 1, quantity: 3 },
          { cart_item_id: 2, quantity: 2 },
        ],
      };
      const mockResponse = { success: true, message: 'Cart items updated' };

      mockCartService.bulkUpdateItems.mockResolvedValue(mockResponse);

      const result = await controller.bulkUpdateItems(userId, bulkUpdateDto);

      expect(service.bulkUpdateItems).toHaveBeenCalledWith(userId, bulkUpdateDto);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const userId = 1;
      const itemId = 1;
      const mockResponse = { success: true, message: 'Item removed from cart' };

      mockCartService.removeItem.mockResolvedValue(mockResponse);

      const result = await controller.removeItem(userId, itemId);

      expect(service.removeItem).toHaveBeenCalledWith(userId, itemId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('clearCart', () => {
    it('should clear entire cart', async () => {
      const userId = 1;
      const mockResponse = { success: true, message: 'Cart cleared' };

      mockCartService.clearCart.mockResolvedValue(mockResponse);

      const result = await controller.clearCart(userId);

      expect(service.clearCart).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('mergeGuestCart', () => {
    it('should merge guest cart with user cart', async () => {
      const userId = 1;
      const guestCartData = {
        items: [
          { product_id: 5, quantity: 1 },
          { product_id: 6, quantity: 2 },
        ],
      };
      const mockResponse = { success: true, message: 'Guest cart merged' };

      mockCartService.mergeGuestCart.mockResolvedValue(mockResponse);

      const result = await controller.mergeGuestCart(userId, guestCartData);

      expect(service.mergeGuestCart).toHaveBeenCalledWith(userId, guestCartData);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('applyCoupon', () => {
    it('should apply coupon to cart', async () => {
      const userId = 1;
      const applyCouponDto: ApplyCouponDto = { coupon_code: 'SAVE20' };
      const mockResponse = {
        success: true,
        message: 'Coupon applied',
        discount_percentage: 20,
        discount_amount: 30.0,
        final_total: 120.0,
      };

      mockCartService.applyCoupon.mockResolvedValue(mockResponse);

      const result = await controller.applyCoupon(userId, applyCouponDto);

      expect(service.applyCoupon).toHaveBeenCalledWith(userId, applyCouponDto);
      expect(result).toEqual(mockResponse);
    });
  });
});
