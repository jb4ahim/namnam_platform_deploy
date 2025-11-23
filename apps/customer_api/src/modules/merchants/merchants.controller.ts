import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getMerchants(
        @Query('latitude', ParseFloatPipe) latitude?: number,
        @Query('longitude', ParseFloatPipe) longitude?: number,
        @Query('categoryId', ParseIntPipe) categoryId?: number,
        @Query('zoneId', ParseIntPipe) zoneId?: number,
        @Query('minRating', ParseFloatPipe) minRating?: number,
        @Query('isOpen') isOpen?: boolean,
        @Query('hasDiscount') hasDiscount?: boolean,
        @Query('limit', ParseIntPipe) limit?: number,
    ) {
        return await this.merchantsService.getMerchants({
        latitude,
        longitude,
        categoryId,
        zoneId,
        minRating,
        isOpen,
        hasDiscount,
        limit,
        });
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getMerchantById(@Param('id', ParseIntPipe) merchantId: number) {
        return await this.merchantsService.getMerchantById(merchantId);
    }
}
