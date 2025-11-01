import { Injectable } from '@nestjs/common';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
    constructor(private readonly repo: CartRepository) {}

    async getCart(userId: number) {
        return this.repo.getCart(userId);
    }

    async getCartSummary(userId: number) {
        return this.repo.getCartSummary(userId);
    }

    async getCartItem(userId: number, itemId: number) {
        return this.repo.getCartItem(userId, itemId);
    }

    async addItem(userId: number, dto: AddItemDto) {
        return this.repo.addItem(userId, dto);
    }

    async updateItem(userId: number, itemId: number, dto: UpdateItemDto) {
        return this.repo.updateItem(userId, itemId, dto);
    }

    async bulkUpdateItems(userId: number, dto: BulkUpdateItemsDto) {
        return this.repo.bulkUpdateItems(userId, dto);
    }

    async removeItem(userId: number, itemId: number) {
        return this.repo.removeItem(userId, itemId);
    }

    async clearCart(userId: number) {
        return this.repo.clearCart(userId);
    }

    async mergeGuestCart(userId: number, guestCartData: any) {
        return this.repo.mergeGuestCart(userId, guestCartData);
    }

    async applyCoupon(userId: number, dto: ApplyCouponDto) {
        return this.repo.applyCoupon(userId, dto);
    }
}
