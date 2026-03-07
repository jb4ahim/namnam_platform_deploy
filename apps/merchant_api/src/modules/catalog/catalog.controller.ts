import { Controller, Get, Post, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { CatalogSectionDto } from './dto/catalog-response.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';

@ApiTags('Catalog')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('sections')
  @ApiOperation({ summary: 'Get all catalog sections' })
  @ApiResponse({ status: 200, type: [CatalogSectionDto], description: 'List of catalog sections with product count' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSections(@CurrentUserId() merchantId: number) {
    return await this.catalogService.getSections(merchantId);
  }

  @Post('sections')
  @ApiOperation({ summary: 'Create a new catalog section' })
  @ApiResponse({ status: 201, type: CatalogSectionDto, description: 'Section created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSection(@Body() createSectionDto: CreateSectionDto, @CurrentUserId() merchantId: number) {
    return await this.catalogService.createSection(createSectionDto, merchantId);
  }

  @Put('sections/:id')
  @ApiOperation({ summary: 'Update a catalog section' })
  @ApiParam({ name: 'id', type: Number, description: 'Section ID' })
  @ApiResponse({ status: 200, description: 'Section updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSection(
    @Param('id', ParseIntPipe) sectionId: number,
    @Body() updateSectionDto: UpdateSectionDto,
    @CurrentUserId() merchantId: number
  ) {
    return await this.catalogService.updateSection(sectionId, updateSectionDto, merchantId);
  }
}
