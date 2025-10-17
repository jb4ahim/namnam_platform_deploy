import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';

@Controller('promotions')
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getPromotions() {
        return await this.promotionsService.getPromotions();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getPromotionById(@Param('id', ParseIntPipe) promotionId: number) {
        return await this.promotionsService.getPromotionById(promotionId);
    }
}
