import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async getAll(parentId?: number) {
    return this.categoriesRepository.getAllCategories(parentId);
  }

  async create(dto: CreateCategoryDto) : Promise<void> {
    return this.categoriesRepository.createCategory(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, dto);
  }
}


