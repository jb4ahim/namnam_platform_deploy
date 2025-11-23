import { Controller, Get, Query } from '@nestjs/common';
import { AppConfigService } from './app-config.service';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('home')
  async getHomeConfig(@Query('zoneId') zoneId?: number) {
    return await this.appConfigService.getHomeConfig(zoneId);
  }
}
