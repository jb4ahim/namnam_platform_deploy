import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly pg: PostgresService) {}

    async getCategories(parentId?: number) {
        try {
            const result = await DatabaseUtils.callFunction(
                this.pg,
                'select_categories_customer',
                [parentId ?? null],
                true
            );
            return result || [];
        } catch (error) {
            const dbErrorCode = (error as { code?: string })?.code;
            // Fallback for environments where legacy customer function is missing.
            if (dbErrorCode === '42883') {
                const fallbackResult = await DatabaseUtils.callFunction(
                    this.pg,
                    'select_categories',
                    [parentId ?? null],
                    true
                );
                return fallbackResult || [];
            }
            throw error;
        }
    }

    async getCategoryById(categoryId: number) {
        const result = await DatabaseUtils.callFunction(
        this.pg,
        'select_category_by_id_customer',
        [categoryId],
        false
        );
        return result;
    }
}
