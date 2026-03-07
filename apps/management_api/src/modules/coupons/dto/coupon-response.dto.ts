import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CouponDto {
  @ApiProperty({ example: 1 })
  coupon_id: number;

  @ApiProperty({ example: 'SAVE20' })
  code: string;

  @ApiProperty({ example: '20% Off Summer Sale' })
  name: string;

  @ApiPropertyOptional({ example: 'Get 20% off on all orders' })
  description?: string;

  @ApiProperty({ example: 'percentage', enum: ['percentage', 'fixed'] })
  discount_type: string;

  @ApiProperty({ example: 25.0 })
  discount_value: number;

  @ApiPropertyOptional({ example: 50.0 })
  max_discount_amount?: number;

  @ApiPropertyOptional({ example: 100.0 })
  min_order_amount?: number;

  @ApiPropertyOptional({ example: '2025-06-01T00:00:00.000Z' })
  starts_at?: string;

  @ApiPropertyOptional({ example: '2025-12-31T23:59:59.000Z' })
  ends_at?: string;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiPropertyOptional({ example: 1000 })
  max_redemptions?: number;

  @ApiProperty({ example: 0 })
  current_redemptions: number;

  @ApiPropertyOptional({ example: 3 })
  per_user_limit?: number;

  @ApiPropertyOptional({ type: [Number], example: [1, 2, 3] })
  applicable_merchant_ids?: number[];

  @ApiPropertyOptional({ type: [Number], example: [10, 20] })
  applicable_product_ids?: number[];

  @ApiProperty({ example: '2025-11-07T06:26:28.081Z' })
  created_at: string;

  @ApiProperty({ example: '2025-11-07T06:32:38.940Z' })
  updated_at: string;
}

export class ValidateCouponResponseDto {
  @ApiProperty({ example: true })
  isValid: boolean;

  @ApiPropertyOptional({ example: 'Coupon is not valid for this order amount' })
  reason?: string;

  @ApiPropertyOptional({ type: CouponDto })
  coupon?: CouponDto;
}
