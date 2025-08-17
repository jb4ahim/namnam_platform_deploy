import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { Console } from 'console';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';


@Injectable()
export class CategoriesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getAllCategories(parentId?: number): Promise<GetCategoryDto[]> {
    console.log(parentId);
    const result = await DatabaseUtils.callFunction<GetCategoryDto[] | GetCategoryDto>(
      this.pg,
      'select_categories',
      [parentId ?? null],
      false
    );
    return (result as GetCategoryDto[]) ?? [];
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
}


