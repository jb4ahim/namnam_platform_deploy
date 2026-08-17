import { Injectable } from '@nestjs/common';
import { AppConfigRepository } from './app-config.repository';
import { CategoriesService } from '../categories/categories.service';
import { S3PresignService } from '@app/storage';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly appConfigRepository: AppConfigRepository,
    private readonly categoriesService: CategoriesService,
    private readonly s3Service: S3PresignService,
  ) {}

  private async resolveImagePath(pathOrUrl: string): Promise<string> {
    if (/^https?:\/\//i.test(pathOrUrl)) {
      return pathOrUrl;
    }

    try {
      return await this.s3Service.getPresignedDownloadUrl(pathOrUrl);
    } catch {
      const bucket = process.env.AWS_S3_BUCKET;
      const region = process.env.AWS_REGION;
      if (!bucket || !region) {
        return pathOrUrl;
      }

      const normalizedKey = pathOrUrl.replace(/^\/+/, '');
      return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
    }
  }

  private async normalizeImagesDeep(value: unknown): Promise<unknown> {
    if (Array.isArray(value)) {
      return Promise.all(value.map(item => this.normalizeImagesDeep(item)));
    }

    if (!value || typeof value !== 'object') {
      return value;
    }

    const keyMap: Record<string, string> = {
      image_key: 'image_url',
      logo_key: 'logo_url',
      cover_key: 'cover_url',
      imageKey: 'imageUrl',
      logoKey: 'logoUrl',
      coverKey: 'coverUrl',
    };

    const output: Record<string, unknown> = { ...(value as Record<string, unknown>) };
    for (const [key, rawVal] of Object.entries(output)) {
      if (typeof rawVal === 'string' && keyMap[key]) {
        const resolved = await this.resolveImagePath(rawVal);
        output[key] = resolved;
        output[keyMap[key]] = resolved;
        continue;
      }

      output[key] = await this.normalizeImagesDeep(rawVal);
    }

    return output;
  }

  private normalizeCategoriesShape(categories: unknown): unknown[] {
    if (!Array.isArray(categories)) {
      return categories ? [categories] : [];
    }

    return categories.flat(Infinity).filter(item => item !== null && item !== undefined);
  }

  async getHomeConfig(zoneId?: number) {
    const [homeConfig, rawCategories] = await Promise.all([
      this.appConfigRepository.getHomeConfig(zoneId),
      // Home API requires top-level/all categories via parentId = 0.
      this.categoriesService.getCategories(0),
    ]);
    const categories = await this.normalizeImagesDeep(this.normalizeCategoriesShape(rawCategories));
    const normalizedHomeConfig = homeConfig
      ? await this.normalizeImagesDeep(homeConfig)
      : null;

    if (!normalizedHomeConfig) {
      return {
        categories,
      };
    }

    return {
      ...normalizedHomeConfig,
      categories,
    };
  }
}
