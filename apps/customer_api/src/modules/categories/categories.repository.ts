import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class CategoriesRepository {
    constructor(private readonly pg: PostgresService) {}

    private async queryCategoriesByFunction(functionName: string, parentId?: number) {
        const hasParentId = parentId !== undefined && parentId !== null;
        const query = hasParentId
            ? `SELECT * FROM ${functionName}($1)`
            : `SELECT * FROM ${functionName}()`;
        const rows = await this.pg.query(query, hasParentId ? [parentId] : []);

        if (!rows || rows.length === 0) {
            return [];
        }

        // Some DB functions can return a single column named after the function itself.
        const firstRow = rows[0];
        if (
            firstRow &&
            typeof firstRow === 'object' &&
            Object.keys(firstRow).length === 1 &&
            Object.prototype.hasOwnProperty.call(firstRow, functionName)
        ) {
            return rows
                .map(row => row[functionName as keyof typeof row])
                .filter(item => item !== null && item !== undefined);
        }

        return rows.filter(item => item !== null && item !== undefined);
    }

    async getCategories(parentId?: number) {
        const functionCandidates = ['select_categories_customer', 'select_categories'];

        for (const functionName of functionCandidates) {
            try {
                const result = await this.queryCategoriesByFunction(functionName, parentId);
                return result || [];
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
