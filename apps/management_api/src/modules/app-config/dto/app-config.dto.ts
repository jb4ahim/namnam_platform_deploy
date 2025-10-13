import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsArray, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

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
  @IsEnum(ActionType)
  type: ActionType;

  @IsString()
  route: string;
}

export class LayoutDto {
  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsBoolean()
  autoScroll?: boolean;

  @IsOptional()
  @IsBoolean()
  showDots?: boolean;

  @IsOptional()
  @IsNumber()
  columns?: number;

  @IsOptional()
  @IsNumber()
  spacing?: number;

  @IsOptional()
  @IsEnum(CardType)
  card?: CardType;

  @IsOptional()
  @IsNumber()
  itemWidth?: number;

  @IsOptional()
  @IsObject()
  showMore?: { route: string };
}

export class DataSourceDto {
  @IsEnum(EntityType)
  entity: EntityType;

  @IsOptional()
  @IsObject()
  filters?: Record<string, any>;

  @IsOptional()
  @IsArray()
  sort?: Array<{ field: string; dir: SortDirection }>;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsObject()
  pagination?: { cursor: any };

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  manual_ids?: number[];
}

export class SectionDto {
  @IsString()
  id: string;

  @IsEnum(ComponentType)
  component: ComponentType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LayoutDto)
  layout?: LayoutDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DataSourceDto)
  data_source?: DataSourceDto;
}

export class AppConfigDto {
  @IsNumber()
  ttl_seconds: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionDto)
  sections: SectionDto[];
}
