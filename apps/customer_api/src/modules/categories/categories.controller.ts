import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getCategories() {
        return await this.categoriesService.getCategories();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getCategoryById(@Param('id', ParseIntPipe) categoryId: number) {
        return await this.categoriesService.getCategoryById(categoryId);
    }
}
