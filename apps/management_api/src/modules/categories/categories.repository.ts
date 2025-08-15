import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { Console } from 'console';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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

  async createCategory(params: CreateCategoryDto): Promise<void> {
    const result = await DatabaseUtils.callProcedure<Category>(
      this.pg,
      'create_category',
      [params.name, params.parentId, params.status, params.imageKey, null]
    );
  }

  async updateCategory(id: string, params: UpdateCategoryDto): Promise<Category> {
    const result = await DatabaseUtils.callProcedure<Category>(
      this.pg,
      'update_category',
      [id, params.name ?? null, params.type ?? null, params.parentId ?? null, params.status ?? null, params.imageKey ?? null]
    );
    if (!result) {
      throw new Error('Failed to update category');
    }
    return result as Category;
  }
}


