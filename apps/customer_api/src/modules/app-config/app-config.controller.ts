import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './app-config.service';
@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('home')
  async getHomeConfig() {
    return await this.appConfigService.getHomeConfig();
  }
}
