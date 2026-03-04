import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get list of categories' })
    @ApiQuery({ name: 'parentId', required: false, type: Number, description: 'Optional parent ID to fetch subcategories' })
    @ApiResponse({ status: 200, description: 'List of categories returned.' })
    async getCategories(@Query('parentId', new ParseIntPipe({ optional: true })) parentId?: number) {
        return await this.categoriesService.getCategories(parentId);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getCategoryById(@Param('id', ParseIntPipe) categoryId: number) {
        return await this.categoriesService.getCategoryById(categoryId);
    }
}
