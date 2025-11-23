import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsRepository {
  constructor(private readonly pg: PostgresService) {}

  async getEntityReviews(
    entityType: 'merchant' | 'product',
    entityId: number,
    limit?: number,
    offset?: number,
    minRating?: number,
    sortBy?: string
  ) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_entity_reviews',
      [entityType, entityId, limit || 20, offset || 0, minRating || null, sortBy || 'newest'],
      false
    );
    return result;
  }

  async getCustomerReview(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_customer_review',
      [userId, entityType, entityId],
      false
    );
    return result;
  }

  async createReview(userId: number, entityType: 'merchant' | 'product', entityId: number, dto: CreateReviewDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'insert_customer_review',
      [userId, entityType, entityId, dto.rating, dto.comment || null]
    );
    return { success: true, message: 'Review submitted successfully' };
  }

  async updateReview(userId: number, reviewId: number, dto: UpdateReviewDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_customer_review',
      [userId, reviewId, dto.rating || null, dto.comment || null]
    );
    return { success: true, message: 'Review updated successfully' };
  }

  async deleteReview(userId: number, reviewId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_customer_review',
      [userId, reviewId]
    );
    return { success: true, message: 'Review deleted successfully' };
  }

  async voteHelpful(userId: number, reviewId: number, isHelpful: boolean) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'vote_review_helpful',
      [userId, reviewId, isHelpful]
    );
    return { success: true, message: 'Vote recorded' };
  }
}
