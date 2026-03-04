import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { AppConfigDto } from './dto/app-config.dto';
import { AppConfigService } from './app-config.service';

@ApiTags('App Config')
@Controller('app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  @Get('home-customer')
  @ApiOperation({ summary: 'Retrieve the dynamic home configuration for the customer app' })
  @ApiResponse({ status: 200, description: 'Home configuration layout returned successfully.' })
  async getHomeConfig() {
    return await this.appConfigService.getHomeConfig();
  }

  @Post('home-customer')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the dynamic home configuration for the customer app' })
  @ApiBody({ type: AppConfigDto, description: 'The new home layout configuration' })
  @ApiResponse({ status: 200, description: 'Home configuration updated successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed for the configuration object.' })
  async updateHomeConfig(@Body() config: AppConfigDto) {
    return await this.appConfigService.updateHomeConfig(config);
  }
}
