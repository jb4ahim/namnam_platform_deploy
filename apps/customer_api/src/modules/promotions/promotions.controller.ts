import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
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
