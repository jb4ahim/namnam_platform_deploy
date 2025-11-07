import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';

@Injectable()
export class CartRepository {
  constructor(private readonly pg: PostgresService) {}

  async getCart(userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_cart_items',
      [userId],
      false
    );
    return result;
  }

  async getCartSummary(userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_cart_summary',
      [userId],
      false
    );
    return result;
  }

  async getCartItem(userId: number, itemId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_cart_item_detail',
      [userId, itemId],
      false
    );
    return result;
  }

  async addItem(userId: number, dto: AddItemDto) {
    try {
      await DatabaseUtils.callProcedure(
        this.pg,
        'add_to_cart',
        [userId, dto.product_id, dto.quantity]
      );
      return { success: true, message: 'Item added to cart' };
    } catch (error) {
      if (error.message.includes('Cart cleared')) {
        return { 
          success: true, 
          message: 'Item added to cart. Previous items from different merchant were removed.',
          cart_cleared: true 
        };
      }
      throw error;
    }
  }

  async updateItem(userId: number, itemId: number, dto: UpdateItemDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_cart_item_quantity',
      [userId, itemId, dto.quantity]
    );
    return { success: true, message: 'Cart item updated' };
  }

  async bulkUpdateItems(userId: number, dto: BulkUpdateItemsDto) {
    for (const item of dto.items) {
      await DatabaseUtils.callProcedure(
        this.pg,
        'update_cart_item_quantity',
        [userId, item.cart_item_id, item.quantity]
      );
    }
    return { success: true, message: 'Cart items updated' };
  }

  async removeItem(userId: number, itemId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'remove_from_cart',
      [userId, itemId]
    );
    return { success: true, message: 'Item removed from cart' };
  }

  async clearCart(userId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'clear_cart',
      [userId]
    );
    return { success: true, message: 'Cart cleared' };
  }

  async mergeGuestCart(userId: number, guestCartData: any) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'merge_guest_cart',
      [userId, JSON.stringify(guestCartData)]
    );
    return { success: true, message: 'Guest cart merged' };
  }

  async applyCoupon(userId: number, dto: ApplyCouponDto) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'apply_coupon_to_cart',
      [userId, dto.coupon_code],
      false
    );
    return result;
  }
}
