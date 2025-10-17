import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';

@Injectable()
export class CategoriesService {
    constructor(private readonly repo: CategoriesRepository) {}

    async getCategories(parentId?: number) {
        return this.repo.getCategories(parentId);
    }

    async getCategoryById(categoryId: number) {
        return this.repo.getCategoryById(categoryId);
    }
}
