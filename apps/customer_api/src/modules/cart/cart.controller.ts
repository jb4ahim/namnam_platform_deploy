import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    async getCart(@CurrentUserId() userId: number) {
        return await this.cartService.getCart(userId);
    }

    @Get('summary')
    async getCartSummary(@CurrentUserId() userId: number) {
        return await this.cartService.getCartSummary(userId);
    }

    @Get('items/:itemId')
    async getCartItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        return await this.cartService.getCartItem(userId, itemId);
    }

    @Post('items')
    async addItem(@CurrentUserId() userId: number, @Body() dto: AddItemDto) {
        return await this.cartService.addItem(userId, dto);
    }

    @Put('items/:itemId')
    async updateItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() dto: UpdateItemDto
    ) {
        return await this.cartService.updateItem(userId, itemId, dto);
    }

    @Put('items/bulk')
    async bulkUpdateItems(
        @CurrentUserId() userId: number,
        @Body() dto: BulkUpdateItemsDto
    ) {
        return await this.cartService.bulkUpdateItems(userId, dto);
    }

    @Delete('items/:itemId')
    async removeItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        return await this.cartService.removeItem(userId, itemId);
    }

    @Delete()
    async clearCart(@CurrentUserId() userId: number) {
        return await this.cartService.clearCart(userId);
    }

    @Post('merge')
    async mergeGuestCart(
        @CurrentUserId() userId: number,
        @Body() guestCartData: any
    ) {
        return await this.cartService.mergeGuestCart(userId, guestCartData);
    }

    @Post('apply-coupon')
    async applyCoupon(
        @CurrentUserId() userId: number,
        @Body() dto: ApplyCouponDto
    ) {
        return await this.cartService.applyCoupon(userId, dto);
    }
}
