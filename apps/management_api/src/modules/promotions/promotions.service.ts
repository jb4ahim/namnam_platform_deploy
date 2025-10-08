import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
  constructor(private readonly promotionsRepository: PromotionsRepository) {}

  async getPromotions() {
    return await this.promotionsRepository.getPromotions();
  }

  async getPromotionById(promotionId: number) {
    const promotion = await this.promotionsRepository.getPromotionById(promotionId);
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    return promotion;
  }

  async createPromotion(createPromotionDto: CreatePromotionDto) {
     await this.promotionsRepository.createPromotion(createPromotionDto);
  }

  async updatePromotion(promotionId: number, updatePromotionDto: UpdatePromotionDto) {
     await this.promotionsRepository.updatePromotion(promotionId, updatePromotionDto);

  }

  async deletePromotion(promotionId: number) {
    await this.promotionsRepository.deletePromotion(promotionId);
  }

  async changePromotionStatus(promotionId: number, isDisabled: boolean) {
    await this.promotionsRepository.changePromotionStatus(promotionId, isDisabled);
  }
}
