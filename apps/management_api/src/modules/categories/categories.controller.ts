import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { GetCategoryDto } from './dto/get-category.dto';

@ApiTags('Categories')
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiQuery({ name: 'parentId', required: false, type: Number, description: 'Filter categories by parent ID' })
  @ApiResponse({ status: 200, type: [GetCategoryDto], description: 'List of categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAll(@Query('parentId') parentId?: number) {
    return this.categoriesService.getAll(parentId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, type: GetCategoryDto, description: 'Category created' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiParam({ name: 'id', type: String, description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, type: GetCategoryDto, description: 'Category updated' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }
}
