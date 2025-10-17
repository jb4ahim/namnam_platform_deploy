import { Injectable } from '@nestjs/common';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
    constructor(private readonly repo: PromotionsRepository) {}

    async getPromotions() {
        return this.repo.getPromotions();
    }

    async getPromotionById(promotionId: number) {
        return this.repo.getPromotionById(promotionId);
    }
}
