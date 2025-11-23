import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getMerchants(
        @Query('latitude', new ParseFloatPipe({ optional: true })) latitude?: number,
        @Query('longitude', new ParseFloatPipe({ optional: true })) longitude?: number,
        @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
        @Query('zoneId', new ParseIntPipe({ optional: true })) zoneId?: number,
        @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    ) {
        return await this.merchantsService.getMerchants({
        latitude,
        longitude,
        categoryId,
        zoneId,
        limit,
        });
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getMerchantById(@Param('id', ParseIntPipe) merchantId: number) {
        return await this.merchantsService.getMerchantById(merchantId);
    }
}
