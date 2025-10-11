import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@app/auth';
import { AppConfigDto } from './dto/app-config.dto';
import { AppConfigService } from './app-config.service';

@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('home-customer')
  async getHomeConfig() {
    return await this.appConfigService.getHomeConfig();
  }

  @Post('home-customer')
  @UseGuards(AuthGuard)
  async updateHomeConfig(@Body() config: AppConfigDto) {
    return await this.appConfigService.updateHomeConfig(config);
  }
}
