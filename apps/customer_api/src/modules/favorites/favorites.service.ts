import { Injectable } from '@nestjs/common';
import { FavoritesRepository } from './favorites.repository';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly repo: FavoritesRepository) {}

  async getFavorites(userId: number, entityType?: 'merchant' | 'product', limit?: number, offset?: number) {
    return this.repo.getFavorites(userId, entityType, limit, offset);
  }

  async checkFavorite(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    return this.repo.checkFavorite(userId, entityType, entityId);
  }

  async addFavorite(userId: number, dto: AddFavoriteDto) {
    return this.repo.addFavorite(userId, dto.entity_type, dto.entity_id);
  }

  async removeFavorite(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    return this.repo.removeFavorite(userId, entityType, entityId);
  }
}
