import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum ActionType {
  NAVIGATE = 'NAVIGATE',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  DEEPLINK = 'DEEPLINK',
}

export enum ComponentType {
  CAROUSEL = 'carousel',
  GRID = 'grid',
  HORIZONTAL_LIST = 'horizontal_list',
  VERTICAL_FEED = 'vertical_feed',
  LOGO_STRIP = 'logo_strip',
}

export enum CardType {
  promotion = 'promotion',
  MERCHANT_COMPACT = 'merchant_compact',
  MERCHANT_LARGE = 'merchant_large',
  PRODUCT = 'product',
}

export enum EntityType {
  MERCHANT = 'merchant',
  PRODUCT = 'product',
  PROMOTION = 'promotion',
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export class ActionDto {
  @ApiProperty({ description: 'The type of action', enum: ActionType })
  @IsEnum(ActionType)
  type: ActionType;

  @ApiProperty({ description: 'The route or target link for the action', example: '/category/123' })
  @IsString()
  route: string;
}

export class LayoutDto {
  @ApiPropertyOptional({ description: 'Height dimension if strictly defined', example: 200 })
  @IsOptional()
  @IsNumber()
  height?: number;

  @ApiPropertyOptional({ description: 'Whether auto scroll is enabled (e.g., for carousels)', example: true })
  @IsOptional()
  @IsBoolean()
  autoScroll?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show pagination dots', example: false })
  @IsOptional()
  @IsBoolean()
  showDots?: boolean;

  @ApiPropertyOptional({ description: 'Number of columns for grid layouts', example: 2 })
  @IsOptional()
  @IsNumber()
  columns?: number;

  @ApiPropertyOptional({ description: 'Spacing between items', example: 16 })
  @IsOptional()
  @IsNumber()
  spacing?: number;

  @ApiPropertyOptional({ description: 'Type of card to render', enum: CardType })
  @IsOptional()
  @IsEnum(CardType)
  card?: CardType;

  @ApiPropertyOptional({ description: 'Specific item width (if custom)', example: 150 })
  @IsOptional()
  @IsNumber()
  itemWidth?: number;

  @ApiPropertyOptional({ description: 'Show more action config', example: { route: '/all-merchants' } })
  @IsOptional()
  @IsObject()
  showMore?: { route: string };
}

export class DataSourceDto {
  @ApiProperty({ description: 'The entity type to fetch data from', enum: EntityType })
  @IsEnum(EntityType)
  entity: EntityType;

  @ApiPropertyOptional({ description: 'Key-value filters for data source', example: { categoryId: 1 } })
  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Sorting configuration' })
  @IsOptional()
  @IsArray()
  sort?: Array<{ field: string; dir: SortDirection }>;

  @ApiPropertyOptional({ description: 'Max items to fetch', example: 10 })
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional({ description: 'Pagination details' })
  @IsOptional()
  @IsObject()
  pagination?: { cursor: any };

  @ApiPropertyOptional({ description: 'Manual list of IDs to render', type: [Number], example: [10, 20, 30] })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  manual_ids?: number[];
}

export class SectionDto {
  @ApiProperty({ description: 'Unique ID of the section', example: 'hero-carousel-1' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'The UI component layout type', enum: ComponentType })
  @IsEnum(ComponentType)
  component: ComponentType;

  @ApiPropertyOptional({ description: 'Section title', example: 'Featured Merchants' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Section subtitle', example: 'Handpicked just for you' })
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional({ description: 'Layout styling configuration', type: () => LayoutDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LayoutDto)
  layout?: LayoutDto;

  @ApiPropertyOptional({ description: 'Data source configuration for dynamic content', type: () => DataSourceDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DataSourceDto)
  data_source?: DataSourceDto;
}

export class AppConfigDto {
  @ApiProperty({ description: 'Time-to-live for cache in seconds', example: 3600 })
  @IsNumber()
  ttl_seconds: number;

  @ApiProperty({ description: 'List of home sections configuration', type: [SectionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}
