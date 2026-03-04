import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({ summary: 'Get active promotions' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return paginated promotions list.' })
  async getPromotions(
    @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId?: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
  ) {
    return await this.promotionsService.getPromotions(categoryId, limit);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getPromotionById(@Param('id', ParseIntPipe) promotionId: number) {
    return await this.promotionsService.getPromotionById(promotionId);
  }
}
