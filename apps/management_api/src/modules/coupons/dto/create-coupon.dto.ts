import { IsArray, IsBoolean, IsDateString, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CouponRuleDto {
  @ApiProperty({ description: 'Rule type for advanced coupon conditions', example: 'minimum_items' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Value for the specific rule', example: 3 })
  @IsOptional()
  @IsNumber()
  value?: number;
}

export class CreateCouponDto {
  @ApiProperty({ description: 'The unique code for the coupon', example: 'SUMMER50' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Display name of the coupon', example: 'Summer 50% Off' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the coupon rules and validity', example: 'Get 50% off up to $20' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Type of discount (PERCENTAGE, FIXED)', example: 'PERCENTAGE' })
  @IsString()
  discountType: string;

  @ApiProperty({ description: 'The discount amount or percentage value', example: 50 })
  @IsNumber()
  discountValue: number;

  @ApiPropertyOptional({ description: 'Maximum cap on the discount amount', example: 20 })
  @IsOptional()
  @IsNumber()
  maxDiscountAmount?: number;

  @ApiPropertyOptional({ description: 'Minimum order amount to use the coupon', example: 100 })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Start date of the coupon', example: '2026-06-01T00:00:00Z' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({ description: 'End date of the coupon', example: '2026-08-31T23:59:59Z' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({ description: 'Is the coupon active currently', example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Maximum total times this coupon can be broadly redeemed', example: 1000 })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxRedemptions?: number;

  @ApiPropertyOptional({ description: 'Maximum times a single user can redeem it', example: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  perUserLimit?: number;

  @ApiPropertyOptional({ description: 'Merchants this coupon applies to', type: [Number], example: [1, 5] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  applicableMerchantIds?: number[];

  @ApiPropertyOptional({ description: 'Products this coupon applies to', type: [Number], example: [10, 11] })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Type(() => Number)
  applicableProductIds?: number[];

  @ApiPropertyOptional({ description: 'Advanced extra rules', type: [CouponRuleDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CouponRuleDto)
  rules?: CouponRuleDto[];
}
