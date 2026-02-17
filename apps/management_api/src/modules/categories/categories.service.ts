import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { plainToInstance } from 'class-transformer';
import { resolveS3Urls, S3PresignService } from '@app/storage';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository,
    private readonly s3Service: S3PresignService
  ) {}

  async getAll(parentId?: number): Promise<GetCategoryDto[]> {
    const categories = await this.categoriesRepository.getAllCategories(parentId);
    return Promise.all(
      categories.map(category =>
        resolveS3Urls(plainToInstance(GetCategoryDto, category), this.s3Service)
      )
    );
  }

  async create(dto: CreateCategoryDto) : Promise<void> {
    return this.categoriesRepository.createCategory(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, dto);
  }
}


