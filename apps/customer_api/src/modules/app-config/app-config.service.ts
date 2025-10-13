import { Injectable } from '@nestjs/common';
import { AppConfigRepository } from './app-config.repository';

@Injectable()
export class AppConfigService {
  constructor(private readonly appConfigRepository: AppConfigRepository) {}

  async getHomeConfig() {
    return await this.appConfigRepository.getHomeConfig();
  }
}
