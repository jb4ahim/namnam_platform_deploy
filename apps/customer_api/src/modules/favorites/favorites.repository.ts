import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class FavoritesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getFavorites(userId: number, entityType?: 'merchant' | 'product', limit?: number, offset?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_customer_favorites',
      [userId, entityType || null, limit || null, offset || null],
      false
    );
    return result || [];
  }

  async checkFavorite(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'check_customer_favorite',
      [userId, entityType, entityId],
      false
    );
    return result;
  }

  async addFavorite(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'insert_customer_favorite',
      [userId, entityType, entityId]
    );
    return { success: true, message: 'Added to favorites' };
  }

  async removeFavorite(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_customer_favorite',
      [userId, entityType, entityId]
    );
    return { success: true, message: 'Removed from favorites' };
  }
}
