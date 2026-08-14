import { Injectable } from '@nestjs/common';
import { AppConfigRepository } from './app-config.repository';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class AppConfigService {
  constructor(
    private readonly appConfigRepository: AppConfigRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async getHomeConfig(zoneId?: number) {
    const [homeConfig, categories] = await Promise.all([
      this.appConfigRepository.getHomeConfig(zoneId),
      this.categoriesService.getCategories(),
    ]);

    if (!homeConfig) {
      return {
        categories,
      };
    }

    return {
      ...homeConfig,
      categories,
    };
  }
}
