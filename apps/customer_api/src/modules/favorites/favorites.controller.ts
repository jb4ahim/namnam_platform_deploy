import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { FavoritesService } from './favorites.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getFavorites(
    @CurrentUserId() userId: number,
    @Query('entityType') entityType?: 'merchant' | 'product',
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
  ) {
    return await this.favoritesService.getFavorites(userId, entityType, limit, offset);
  }

  @Get('check/:entityType/:entityId')
  async checkFavorite(
    @CurrentUserId() userId: number,
    @Param('entityType') entityType: 'merchant' | 'product',
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    const isFavorite = await this.favoritesService.checkFavorite(userId, entityType, entityId);
    return { is_favorite: isFavorite };
  }

  @Post()
  async addFavorite(@CurrentUserId() userId: number, @Body() dto: AddFavoriteDto) {
    return await this.favoritesService.addFavorite(userId, dto);
  }

  @Delete(':entityType/:entityId')
  async removeFavorite(
    @CurrentUserId() userId: number,
    @Param('entityType') entityType: 'merchant' | 'product',
    @Param('entityId', ParseIntPipe) entityId: number,
  ) {
    return await this.favoritesService.removeFavorite(userId, entityType, entityId);
  }
}
