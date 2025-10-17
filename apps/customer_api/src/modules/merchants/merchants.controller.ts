import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getMerchants(
        @Query('categoryId', ParseIntPipe) categoryId?: number,
        @Query('latitude') latitude?: number,
        @Query('longitude') longitude?: number
    ) {
        return await this.merchantsService.getMerchants(categoryId, latitude, longitude);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getMerchantById(@Param('id', ParseIntPipe) merchantId: number) {
        return await this.merchantsService.getMerchantById(merchantId);
    }
}
