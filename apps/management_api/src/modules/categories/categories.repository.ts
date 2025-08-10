import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
};

@Injectable()
export class CategoriesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getAllCategories(): Promise<Category[]> {
    const result = await DatabaseUtils.callFunction<Category[] | Category>(
      this.pg,
      'management_get_categories_json',
      [],
      true
    );
    return (result as Category[]) ?? [];
  }

  async createCategory(params: { name: string; description?: string | null }): Promise<Category> {
    const result = await DatabaseUtils.callFunction<Category>(
      this.pg,
      'management_create_category_json',
      [params.name, params.description ?? null],
      false
    );
    if (!result) {
      throw new Error('Failed to create category');
    }
    return result as Category;
  }

  async updateCategory(id: string, params: { name?: string; description?: string | null; is_active?: boolean }): Promise<Category> {
    const result = await DatabaseUtils.callFunction<Category>(
      this.pg,
      'management_update_category_json',
      [id, params.name ?? null, params.description ?? null, params.is_active ?? null],
      false
    );
    if (!result) {
      throw new Error('Failed to update category');
    }
    return result as Category;
  }
}


