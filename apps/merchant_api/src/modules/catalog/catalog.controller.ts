import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  // Section endpoints
  @Get('sections')
  @UseGuards(AuthGuard)
  async getSections(@CurrentUserId() merchantId: number) {
    console.log('Merchant ID from request:', merchantId);
    return await this.catalogService.getSections(merchantId);
  }

  @Post('sections')
  @UseGuards(AuthGuard)
  async createSection(@Body() createSectionDto: CreateSectionDto, @CurrentUserId() merchantId: number) {
    console.log('Merchant ID from request:', merchantId);
    
    return await this.catalogService.createSection(createSectionDto, merchantId);
  }

  @Put('sections/:id')
  @UseGuards(AuthGuard)
  async updateSection(
    @Param('id', ParseIntPipe) sectionId: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @CurrentUserId() merchantId: number
  ) {
    return await this.catalogService.updateSection(sectionId, updateSectionDto, merchantId);
  }
}
