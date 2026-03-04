import { Controller, Get, Param, ParseFloatPipe, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MerchantsService } from './merchants.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
@ApiTags('Merchants')
@ApiBearerAuth()
@Controller('merchants')
export class MerchantsController {
    constructor(private readonly merchantsService: MerchantsService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get list of merchants within optional parameters' })
    @ApiQuery({ name: 'latitude', required: false, type: Number })
    @ApiQuery({ name: 'longitude', required: false, type: Number })
    @ApiQuery({ name: 'categoryId', required: false, type: Number })
    @ApiQuery({ name: 'zoneId', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiResponse({ status: 200, description: 'List of merchants returned.' })
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
    @ApiOperation({ summary: 'Get merchant details by ID' })
    @ApiParam({ name: 'id', description: 'Merchant ID' })
    @ApiResponse({ status: 200, description: 'Return merchant details.' })
    async getMerchantById(
        @Param('id', ParseIntPipe) merchantId: number,
        @CurrentUserId() userId: number,
    ) {
        return await this.merchantsService.getMerchantById(merchantId, userId);
    }
}
