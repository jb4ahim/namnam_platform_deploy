import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class PromotionsRepository {
    constructor(private readonly pg: PostgresService) {}

    async getPromotions() {
        const result = await DatabaseUtils.callFunction(
        this.pg,
        'select_promotions_customer',
        [],
        true
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
}
