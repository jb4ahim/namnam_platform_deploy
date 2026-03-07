import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { PromotionDto } from './dto/promotion-response.dto';
import { AuthGuard } from '@app/auth';
import { PromotionsService } from './promotions.service';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a list of all promotions' })
  @ApiResponse({ status: 200, type: [PromotionDto], description: 'List of promotions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPromotions() {
    return await this.promotionsService.getPromotions();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a specific promotion by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: PromotionDto, description: 'Promotion details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async getPromotionById(@Param('id', ParseIntPipe) promotionId: number) {
    return await this.promotionsService.getPromotionById(promotionId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new promotion banner' })
  @ApiBody({ type: CreatePromotionDto })
  @ApiResponse({ status: 201, type: PromotionDto, description: 'Promotion created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPromotion(@Body() createPromotionDto: CreatePromotionDto) {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an existing promotion' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdatePromotionDto })
  @ApiResponse({ status: 200, type: PromotionDto, description: 'Promotion updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async updatePromotion(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body() updatePromotionDto: UpdatePromotionDto
  ) {
    return await this.promotionsService.updatePromotion(promotionId, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Promotion deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Promotion not found' })
  async deletePromotion(@Param('id', ParseIntPipe) promotionId: number) {
    return await this.promotionsService.deletePromotion(promotionId);
  }

  @Patch(':id/change-status')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Enable or disable a promotion' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ schema: { type: 'object', properties: { isDisabled: { type: 'boolean', example: true } } } })
  @ApiResponse({ status: 200, description: 'Promotion status updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePromotionStatus(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body('isDisabled') isDisabled: boolean
  ) {
    return await this.promotionsService.changePromotionStatus(promotionId, isDisabled);
  }
}
