import { Injectable } from '@nestjs/common';
import { ReviewsRepository } from './reviews.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VoteHelpfulDto } from './dto/vote-helpful.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly repo: ReviewsRepository) {}

  async getEntityReviews(
    entityType: 'merchant' | 'product',
    entityId: number,
    limit?: number,
    offset?: number,
    minRating?: number,
    sortBy?: string
  ) {
    return this.repo.getEntityReviews(entityType, entityId, limit, offset, minRating, sortBy);
  }

  async getCustomerReview(userId: number, entityType: 'merchant' | 'product', entityId: number) {
    return this.repo.getCustomerReview(userId, entityType, entityId);
  }

  async createReview(userId: number, entityType: 'merchant' | 'product', entityId: number, dto: CreateReviewDto) {
    return this.repo.createReview(userId, entityType, entityId, dto);
  }

  async updateReview(userId: number, reviewId: number, dto: UpdateReviewDto) {
    return this.repo.updateReview(userId, reviewId, dto);
  }

  async deleteReview(userId: number, reviewId: number) {
    return this.repo.deleteReview(userId, reviewId);
  }

  async voteHelpful(userId: number, reviewId: number, dto: VoteHelpfulDto) {
    return this.repo.voteHelpful(userId, reviewId, dto.is_helpful);
  }
}
