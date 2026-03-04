import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AppConfigService } from './app-config.service';

@ApiTags('App Config')
@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('home')
  @ApiOperation({ summary: 'Get home page dynamic configuration' })
  @ApiQuery({ name: 'zoneId', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Return home config.' })
  async getHomeConfig(@Query('zoneId') zoneId?: number) {
    return await this.appConfigService.getHomeConfig(zoneId);
  }
}
