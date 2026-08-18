import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';


@Injectable()
export class CategoriesRepository {
  constructor(private readonly pg: PostgresService) {}

  private normalizeCategoriesResult(result: unknown): GetCategoryDto[] {
    if (!result) {
      return [];
    }

    if (Array.isArray(result)) {
      return result.filter((item): item is GetCategoryDto => item !== null && item !== undefined);
    }

    return [result as GetCategoryDto];
  }

  private async queryCategories(functionName: string, params: any[]): Promise<GetCategoryDto[]> {
    const result = await DatabaseUtils.callFunction<GetCategoryDto[] | GetCategoryDto>(
      this.pg,
      functionName,
      params,
      true
    );
    return this.normalizeCategoriesResult(result);
  }

  async getAllCategories(parentId?: number): Promise<GetCategoryDto[]> {
    const hasParentId = parentId !== undefined && parentId !== null;

    // Some DBs expose select_categories(parent_id), others select_categories().
    const withNullableArg = await this.queryCategories('select_categories', [hasParentId ? parentId : null]);
    if (withNullableArg.length > 0 || hasParentId) {
      return withNullableArg;
    }

    const withoutArgs = await this.queryCategories('select_categories', []);
    return withoutArgs;
  }

  async createCategory(params: CreateCategoryDto): Promise<void> {
    const result = await DatabaseUtils.callProcedure<CreateCategoryDto>(
      this.pg,
      'create_category',
      [params.name, params.parentId, params.status, params.imageKey, null]
    );
  }

  async updateCategory(id: string, params: UpdateCategoryDto): Promise<void> {
     await DatabaseUtils.callProcedure<UpdateCategoryDto>(
      this.pg,
      'update_category',
      [id, params.name ?? null, params.parentId ?? null, params.status ?? null, params.imageKey ?? null]
    );
  }

  async deleteCategory(id: number): Promise<void> {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_category',
      [id],
    );
  }
}


