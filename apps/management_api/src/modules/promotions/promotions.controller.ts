import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';
import { PromotionsService } from './promotions.service';

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
  async getPromotionById(
    @Param('id', ParseIntPipe) promotionId: number,
  ) {
    return await this.promotionsService.getPromotionById(promotionId);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto
  ) {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updatePromotion(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body() updatePromotionDto: UpdatePromotionDto
  ) {
    return await this.promotionsService.updatePromotion(promotionId, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deletePromotion(
    @Param('id', ParseIntPipe) promotionId: number
  ) {
    return await this.promotionsService.deletePromotion(promotionId);
  }

  @Patch(':id/change-status')
  @UseGuards(AuthGuard)
  async changePromotionStatus(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body('isDisabled') isDisabled: boolean
  ) {
    return await this.promotionsService.changePromotionStatus(promotionId, isDisabled);
  }
}
