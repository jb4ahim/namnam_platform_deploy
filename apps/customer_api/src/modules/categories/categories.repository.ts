import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly pg: PostgresService) {}

    private normalizeCategoryResult(result: unknown): unknown[] {
        if (!result) {
            return [];
        }

        if (Array.isArray(result)) {
            return result
                .flat(Infinity)
                .filter(item => item !== null && item !== undefined);
        }

        return [result];
    }

    private async queryCategoriesByFunction(functionName: string, params: any[]) {
        const result = await DatabaseUtils.callFunction(
            this.pg,
            functionName,
            params,
            true
        );
        return this.normalizeCategoryResult(result);
    }

    async getCategories(parentId?: number) {
        const functionCandidates = ['select_categories_customer', 'select_categories'];
        const hasParentId = parentId !== undefined && parentId !== null;

        for (const functionName of functionCandidates) {
            try {
                // Try nullable-arg signature first to support functions that require one argument.
                const argResult = await this.queryCategoriesByFunction(
                    functionName,
                    [hasParentId ? parentId : null]
                );
                if (argResult.length > 0 || hasParentId) {
                    return argResult;
                }

                // If parent is omitted and nullable-arg returned nothing, try no-arg signature.
                const noArgResult = await this.queryCategoriesByFunction(functionName, []);
                if (noArgResult.length > 0) {
                    return noArgResult;
                }
            } catch (error) {
                const dbErrorCode = (error as { code?: string })?.code;
                // 42883 => function does not exist for current signature, try next function candidate.
                if (dbErrorCode === '42883') {
                    continue;
                }
                throw error;
            }
        }

        return [];
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
