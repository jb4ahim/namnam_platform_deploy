import { Injectable } from '@nestjs/common';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
    constructor(private readonly repo: PromotionsRepository) {}

    async getPromotions(categoryId?: number, isFeatured?: boolean, limit?: number) {
        return this.repo.getPromotions(categoryId, isFeatured, limit);
    }

    async getPromotionById(promotionId: number) {
        return this.repo.getPromotionById(promotionId);
    }
}
