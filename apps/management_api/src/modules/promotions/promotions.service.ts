import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
  constructor(private readonly promotionsRepository: PromotionsRepository) {}

  private normalizeImageUrl(imageKey?: string): string | undefined {
    if (!imageKey) {
      return imageKey;
    }

    // Keep existing full URLs unchanged.
    if (/^https?:\/\//i.test(imageKey)) {
      return imageKey;
    }

    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    if (!bucket || !region) {
      return imageKey;
    }

    const normalizedKey = imageKey.replace(/^\/+/, '');
    return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
  }

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
    const payload: CreatePromotionDto = {
      ...createPromotionDto,
      imageKey: this.normalizeImageUrl(createPromotionDto.imageKey) ?? createPromotionDto.imageKey,
    };
    await this.promotionsRepository.createPromotion(payload);
  }

  async updatePromotion(promotionId: number, updatePromotionDto: UpdatePromotionDto) {
    const payload: UpdatePromotionDto = {
      ...updatePromotionDto,
      imageKey: this.normalizeImageUrl(updatePromotionDto.imageKey),
    };
    await this.promotionsRepository.updatePromotion(promotionId, payload);

  }

  async deletePromotion(promotionId: number) {
    await this.promotionsRepository.deletePromotion(promotionId);
  }

  async changePromotionStatus(promotionId: number, isDisabled: boolean) {
    await this.promotionsRepository.changePromotionStatus(promotionId, isDisabled);
  }
}
