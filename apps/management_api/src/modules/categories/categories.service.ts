import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { plainToInstance } from 'class-transformer';
import { S3PresignService } from '@app/storage';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository,
    private readonly s3Service: S3PresignService
  ) {}

  async getAll(parentId?: number): Promise<GetCategoryDto[]> {
    const categories = await this.categoriesRepository.getAllCategories(parentId);
        const dtos = await Promise.all(categories.map(async category => {
          const imageUrl = category.imageKey
            ? await this.s3Service.getPresignedDownloadUrl(category.imageKey)
            : null;
          return plainToInstance(GetCategoryDto, {
            ...category,
            imageUrl,
          });
        }));
    return dtos;
  }

  async create(dto: CreateCategoryDto) : Promise<void> {
    return this.categoriesRepository.createCategory(dto);
  }

  async update(id: string, dto: UpdateCategoryDto) {
    return this.categoriesRepository.updateCategory(id, dto);
  }
}


