import { Injectable, NotFoundException } from '@nestjs/common';
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

  private normalizeImageUrl(imageKey?: string): string | undefined {
    if (!imageKey) {
      return imageKey;
    }

    if (/^https?:\/\//i.test(imageKey)) {
      return imageKey;
    }

    const bucket = process.env.AWS_S3_BUCKET;
    const region = process.env.AWS_REGION;
    if (!bucket || !region) {
      return imageKey;
    }

    const normalizedKey = imageKey.replace(/^\/+/, '');
    return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
  }

  async getAll(parentId?: number): Promise<GetCategoryDto[]> {
    const categories = await this.categoriesRepository.getAllCategories(parentId);
    return Promise.all(
      categories.map(category =>
        resolveS3Urls(plainToInstance(GetCategoryDto, category), this.s3Service)
      )
    );
  }

  async create(dto: CreateCategoryDto) : Promise<void> {
    const payload: CreateCategoryDto = {
      ...dto,
      imageKey: this.normalizeImageUrl(dto.imageKey),
    };
    return this.categoriesRepository.createCategory(payload);
  }

  async update(dto: UpdateCategoryDto) {
    const payload: UpdateCategoryDto = {
      ...dto,
      imageKey: this.normalizeImageUrl(dto.imageKey),
    };
    return this.categoriesRepository.updateCategory(payload);
  }

  async delete(id: number) {
    try {
      await this.categoriesRepository.deleteCategory(id);
      return { success: true };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('not found')) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      throw error;
    }
  }
}


