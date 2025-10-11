import { Injectable } from '@nestjs/common';
import { AppConfigDto } from './dto/app-config.dto';
import { AppConfigRepository } from './app-config.repository';

@Injectable()
export class AppConfigService {
  constructor(private readonly appConfigRepository: AppConfigRepository) {}

  async getHomeConfig() {
    return await this.appConfigRepository.getHomeConfig();
  }

  async updateHomeConfig(config: AppConfigDto) {
    return await this.appConfigRepository.updateHomeConfig(config);
  }
}
