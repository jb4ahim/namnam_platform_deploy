import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { Console } from 'console';

export type Category = {
  id: string;
  name: string;
  description?: string | null;
  is_active?: boolean;
  parent_id?: string | null;
};

@Injectable()
export class CategoriesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getAllCategories(parentId?: number): Promise<Category[]> {
    console.log(parentId);
    const result = await DatabaseUtils.callFunction<Category[] | Category>(
      this.pg,
      'select_categories',
      [parentId ?? null],
      false
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


