import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getProducts(@Query('merchantId', ParseIntPipe) merchantId?: number) {
        return await this.productsService.getProducts(merchantId);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async getProductById(@Param('id', ParseIntPipe) productId: number) {
        return await this.productsService.getProductById(productId);
    }
    }
