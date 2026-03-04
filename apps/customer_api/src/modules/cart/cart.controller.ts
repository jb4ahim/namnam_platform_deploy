import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CartService } from './cart.service';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    @ApiOperation({ summary: 'Get current user cart' })
    @ApiResponse({ status: 200, description: 'Return current user cart contents.' })
    async getCart(@CurrentUserId() userId: number) {
        return await this.cartService.getCart(userId);
    }

    @Get('summary')
    @ApiOperation({ summary: 'Get cart financial summary' })
    @ApiResponse({ status: 200, description: 'Return cart summary including totals.' })
    async getCartSummary(@CurrentUserId() userId: number) {
        return await this.cartService.getCartSummary(userId);
    }

    @Get('items/:itemId')
    @ApiOperation({ summary: 'Get specific cart item details' })
    @ApiParam({ name: 'itemId', description: 'Item ID in cart' })
    @ApiResponse({ status: 200, description: 'Return item details.' })
    async getCartItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        return await this.cartService.getCartItem(userId, itemId);
    }

    @Post('items')
    @ApiOperation({ summary: 'Add item to cart' })
    @ApiResponse({ status: 201, description: 'Item added successfully.' })
    async addItem(@CurrentUserId() userId: number, @Body() dto: AddItemDto) {
        return await this.cartService.addItem(userId, dto);
    }

    @Put('items/:itemId')
    @ApiOperation({ summary: 'Update cart item quantity/options' })
    @ApiParam({ name: 'itemId', description: 'Item ID in cart' })
    @ApiResponse({ status: 200, description: 'Item updated successfully.' })
    async updateItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number,
        @Body() dto: UpdateItemDto
    ) {
        return await this.cartService.updateItem(userId, itemId, dto);
    }

    @Put('items/bulk')
    @ApiOperation({ summary: 'Bulk update cart items' })
    @ApiResponse({ status: 200, description: 'Cart items updated.' })
    async bulkUpdateItems(
        @CurrentUserId() userId: number,
        @Body() dto: BulkUpdateItemsDto
    ) {
        return await this.cartService.bulkUpdateItems(userId, dto);
    }

    @Delete('items/:itemId')
    @ApiOperation({ summary: 'Remove item from cart' })
    @ApiParam({ name: 'itemId', description: 'Item ID in cart' })
    @ApiResponse({ status: 200, description: 'Item removed successfully.' })
    async removeItem(
        @CurrentUserId() userId: number,
        @Param('itemId', ParseIntPipe) itemId: number
    ) {
        return await this.cartService.removeItem(userId, itemId);
    }

    @Delete()
    @ApiOperation({ summary: 'Clear entire cart' })
    @ApiResponse({ status: 200, description: 'Cart cleared successfully.' })
    async clearCart(@CurrentUserId() userId: number) {
        return await this.cartService.clearCart(userId);
    }

    @Post('merge')
    @ApiOperation({ summary: 'Merge guest cart into user cart after login' })
    @ApiBody({ schema: { type: 'object' }, description: 'Guest cart data to merge' })
    @ApiResponse({ status: 201, description: 'Carts merged successfully.' })
    async mergeGuestCart(
        @CurrentUserId() userId: number,
        @Body() guestCartData: any
    ) {
        return await this.cartService.mergeGuestCart(userId, guestCartData);
    }

    @Post('apply-coupon')
    @ApiOperation({ summary: 'Apply coupon to cart' })
    @ApiResponse({ status: 201, description: 'Coupon applied successfully.' })
    @ApiResponse({ status: 400, description: 'Invalid or expired coupon.' })
    async applyCoupon(
        @CurrentUserId() userId: number,
        @Body() dto: ApplyCouponDto
    ) {
        return await this.cartService.applyCoupon(userId, dto);
    }
}
