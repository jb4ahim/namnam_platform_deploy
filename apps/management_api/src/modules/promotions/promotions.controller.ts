import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators/current-user-id.decorator';
import { PromotionsService } from './promotions.service';

@ApiTags('Promotions')
@ApiBearerAuth()
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a list of all promotions' })
  @ApiResponse({ status: 200, description: 'List of promotions returned successfully.' })
  async getPromotions() {
    return await this.promotionsService.getPromotions();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Retrieve a specific promotion by ID' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the promotion to retrieve', example: 1 })
  @ApiResponse({ status: 200, description: 'Promotion returned successfully.' })
  @ApiResponse({ status: 404, description: 'Promotion not found.' })
  async getPromotionById(
    @Param('id', ParseIntPipe) promotionId: number,
  ) {
    return await this.promotionsService.getPromotionById(promotionId);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new promotion banner' })
  @ApiBody({ type: CreatePromotionDto, description: 'The payload to create a new promotion' })
  @ApiResponse({ status: 201, description: 'Promotion created successfully.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto
  ) {
    return await this.promotionsService.createPromotion(createPromotionDto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an existing promotion' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the promotion to update', example: 1 })
  @ApiBody({ type: UpdatePromotionDto, description: 'The updated promotion data' })
  @ApiResponse({ status: 200, description: 'Promotion updated successfully.' })
  @ApiResponse({ status: 404, description: 'Promotion not found.' })
  async updatePromotion(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body() updatePromotionDto: UpdatePromotionDto
  ) {
    return await this.promotionsService.updatePromotion(promotionId, updatePromotionDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the promotion to delete', example: 1 })
  @ApiResponse({ status: 200, description: 'Promotion deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Promotion not found.' })
  async deletePromotion(
    @Param('id', ParseIntPipe) promotionId: number
  ) {
    return await this.promotionsService.deletePromotion(promotionId);
  }

  @Patch(':id/change-status')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Enable or disable a promotion (change status)' })
  @ApiParam({ name: 'id', type: 'number', description: 'The ID of the promotion', example: 1 })
  @ApiBody({ schema: { type: 'object', properties: { isDisabled: { type: 'boolean', example: true } } } })
  @ApiResponse({ status: 200, description: 'Promotion status updated successfully.' })
  async changePromotionStatus(
    @Param('id', ParseIntPipe) promotionId: number,
    @Body('isDisabled') isDisabled: boolean
  ) {
    return await this.promotionsService.changePromotionStatus(promotionId, isDisabled);
  }
}
