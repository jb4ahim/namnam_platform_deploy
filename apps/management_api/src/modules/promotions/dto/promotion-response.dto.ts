import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromotionDto {
  @ApiProperty({ example: 1 })
  promotion_id: number;

  @ApiProperty({ example: 'Special Offer on Electronics' })
  title_english: string;

  @ApiProperty({ example: 'عرض خاص على الإلكترونيات' })
  title_arabic: string;

  @ApiPropertyOptional({ example: 'Huge discounts on selected electronics categories.' })
  description_english?: string;

  @ApiPropertyOptional({ example: 'خصومات كبيرة على فئات الإلكترونيات المختارة.' })
  description_arabic?: string;

  @ApiPropertyOptional({ example: 'promo_electronics_banner.webp' })
  image_key?: string;

  @ApiProperty({ example: 'NAVIGATE_TO_CATEGORY', enum: ['NAVIGATE_TO_CATEGORY', 'NAVIGATE_TO_EXTERNAL_URL', 'NAVIGATE_TO_DEEPLINK'] })
  action_type: string;

  @ApiPropertyOptional({ example: 14 })
  category_id?: number;

  @ApiPropertyOptional({ example: 'https://example.com' })
  external_url?: string;

  @ApiPropertyOptional({ example: 'namnam://category/14' })
  deeplink?: string;

  @ApiProperty({ example: 1 })
  display_order: number;

  @ApiProperty({ example: false })
  is_disabled: boolean;

  @ApiProperty({ example: '2025-10-08T07:13:01.431Z' })
  created_at: string;

  @ApiProperty({ example: '2025-10-08T07:13:01.431Z' })
  updated_at: string;
}
