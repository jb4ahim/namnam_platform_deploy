import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, Query, UseGuards, ParseFloatPipe } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { VoteHelpfulDto } from './dto/vote-helpful.dto';

@Controller('reviews')
@UseGuards(AuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // Get reviews for a product
  @Get('products/:productId')
  async getProductReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('minRating', new ParseFloatPipe({ optional: true })) minRating?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    return await this.reviewsService.getEntityReviews('product', productId, limit, offset, minRating, sortBy);
  }

  // Get reviews for a merchant
  @Get('merchants/:merchantId')
  async getMerchantReviews(
    @Param('merchantId', ParseIntPipe) merchantId: number,
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number,
    @Query('offset', new ParseIntPipe({ optional: true })) offset?: number,
    @Query('minRating', new ParseFloatPipe({ optional: true })) minRating?: number,
    @Query('sortBy') sortBy?: string,
  ) {
    return await this.reviewsService.getEntityReviews('merchant', merchantId, limit, offset, minRating, sortBy);
  }

  // Create review for a product
  @Post('products/:productId')
  async createProductReview(
    @CurrentUserId() userId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return await this.reviewsService.createReview(userId, 'product', productId, dto);
  }

  // Create review for a merchant
  @Post('merchants/:merchantId')
  async createMerchantReview(
    @CurrentUserId() userId: number,
    @Param('merchantId', ParseIntPipe) merchantId: number,
    @Body() dto: CreateReviewDto,
  ) {
    return await this.reviewsService.createReview(userId, 'merchant', merchantId, dto);
  }

  // Update review
  @Put(':reviewId')
  async updateReview(
    @CurrentUserId() userId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() dto: UpdateReviewDto,
  ) {
    return await this.reviewsService.updateReview(userId, reviewId, dto);
  }

  // Delete review
  @Delete(':reviewId')
  async deleteReview(
    @CurrentUserId() userId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
  ) {
    return await this.reviewsService.deleteReview(userId, reviewId);
  }

  // Vote review helpful
  @Post(':reviewId/vote-helpful')
  async voteHelpful(
    @CurrentUserId() userId: number,
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() dto: VoteHelpfulDto,
  ) {
    return await this.reviewsService.voteHelpful(userId, reviewId, dto);
  }
}
