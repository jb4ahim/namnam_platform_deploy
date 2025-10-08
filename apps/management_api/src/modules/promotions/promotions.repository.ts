import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getPromotions() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_promotions_management',
      []
    );
    return result || [];
  }

  async getPromotionById(promotionId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_promotion_by_id',
      [promotionId],
      false
    );
    return result;
  }

  async createPromotion(promotionDto: CreatePromotionDto) {

    await DatabaseUtils.callProcedure(
      this.pg,
      'insert_promotion_management',
      [
        promotionDto.titleArabic,
        promotionDto.titleEnglish,
        promotionDto.imageKey,
        promotionDto.actionType,
        promotionDto.descriptionArabic || null,
        promotionDto.descriptionEnglish || null,
        promotionDto.categoryId || null,
        promotionDto.externalUrl || null,
        promotionDto.deeplink || null,
        promotionDto.displayOrder || null,
        promotionDto.isDisabled || false,
        promotionDto.productIds || null
      ]
    );
  }

  async updatePromotion(promotionId: number, promotionDto: UpdatePromotionDto) {

    await DatabaseUtils.callProcedure(
      this.pg,
      'update_promotion_management',
      [
        promotionId,
        promotionDto.titleArabic || null,
        promotionDto.titleEnglish || null,
        promotionDto.descriptionArabic || null,
        promotionDto.descriptionEnglish || null,
        promotionDto.imageKey || null,
        promotionDto.actionType || null,
        promotionDto.categoryId || null,
        promotionDto.productIds || null,
        promotionDto.externalUrl || null,
        promotionDto.deeplink || null
      ]
      );

  }

  async deletePromotion(promotionId: number) {
    console.log('Deleting promotion for promotionId:', promotionId);
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_promotion_management',
      [promotionId]
    );
  }

  async changePromotionStatus(promotionId: number, isDisabled: boolean) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_promotion_status_management',
      [promotionId, isDisabled]
    );
  }
}
