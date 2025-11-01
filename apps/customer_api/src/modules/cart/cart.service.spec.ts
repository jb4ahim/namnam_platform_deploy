import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

describe('CartService', () => {
  let service: CartService;
  let repository: CartRepository;

  const mockCartRepository = {
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
      providers: [
        CartService,
        {
          provide: CartRepository,
          useValue: mockCartRepository,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    repository = module.get<CartRepository>(CartRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should call repository getCart method', async () => {
      const userId = 1;
      const mockCart = {
        cart_id: 1,
        customer_id: userId,
        items: [],
      };

      mockCartRepository.getCart.mockResolvedValue(mockCart);

      const result = await service.getCart(userId);

      expect(repository.getCart).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCart);
    });
  });

  describe('getCartSummary', () => {
    it('should return cart summary', async () => {
      const userId = 1;
      const mockSummary = {
        total_items: 2,
        total_price: 100.0,
        discount_applied: false,
        discount_amount: 0,
        final_total: 100.0,
      };

      mockCartRepository.getCartSummary.mockResolvedValue(mockSummary);

      const result = await service.getCartSummary(userId);

      expect(repository.getCartSummary).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockSummary);
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const userId = 1;
      const addItemDto: AddItemDto = {
        product_id: 10,
        quantity: 2,
      };

      mockCartRepository.addItem.mockResolvedValue({
        success: true,
        message: 'Item added to cart',
      });

      const result = await service.addItem(userId, addItemDto);

      expect(repository.addItem).toHaveBeenCalledWith(userId, addItemDto);
      expect(result.success).toBe(true);
    });
  });

  describe('updateItem', () => {
    it('should update cart item quantity', async () => {
      const userId = 1;
      const itemId = 1;
      const updateItemDto: UpdateItemDto = { quantity: 5 };

      mockCartRepository.updateItem.mockResolvedValue({
        success: true,
        message: 'Cart item updated',
      });

      const result = await service.updateItem(userId, itemId, updateItemDto);

      expect(repository.updateItem).toHaveBeenCalledWith(
        userId,
        itemId,
        updateItemDto
      );
      expect(result.success).toBe(true);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const userId = 1;
      const itemId = 1;

      mockCartRepository.removeItem.mockResolvedValue({
        success: true,
        message: 'Item removed from cart',
      });

      const result = await service.removeItem(userId, itemId);

      expect(repository.removeItem).toHaveBeenCalledWith(userId, itemId);
      expect(result.success).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('should clear cart', async () => {
      const userId = 1;

      mockCartRepository.clearCart.mockResolvedValue({
        success: true,
        message: 'Cart cleared',
      });

      const result = await service.clearCart(userId);

      expect(repository.clearCart).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
    });
  });

  describe('applyCoupon', () => {
    it('should apply coupon to cart', async () => {
      const userId = 1;
      const applyCouponDto: ApplyCouponDto = { coupon_code: 'SAVE20' };
      const mockResponse = {
        success: true,
        discount_percentage: 20,
      };

      mockCartRepository.applyCoupon.mockResolvedValue(mockResponse);

      const result = await service.applyCoupon(userId, applyCouponDto);

      expect(repository.applyCoupon).toHaveBeenCalledWith(userId, applyCouponDto);
      expect(result.success).toBe(true);
    });
  });
});
