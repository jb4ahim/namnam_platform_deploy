import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getCategories() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_categories_customer',
      [],
      true
    );
    return result || [];
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
