import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoriesRepository) {}

  async getCategories() {
    return this.repo.getCategories();
  }

  async getCategoryById(categoryId: number) {
    return this.repo.getCategoryById(categoryId);
  }
}
