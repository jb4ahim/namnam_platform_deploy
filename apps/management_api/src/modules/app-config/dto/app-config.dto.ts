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
  type: ActionType;
  route: string;
}


export class LayoutDto {
  height?: number;
  autoScroll?: boolean;
  showDots?: boolean;
  columns?: number;
  spacing?: number;
  card?: CardType;
  itemWidth?: number;
  showMore?: { route: string };
}

export class DataSourceDto {
  entity: EntityType;
  filters: Record<string, any>;
  sort?: Array<{ field: string; dir: SortDirection }>;
  limit?: number;
  pagination?: { cursor: any };
  manual_ids?: number[]; // IDs for manually selected items
}

export class SectionDto {
  id: string;
  component: ComponentType;
  title?: string;
  subtitle?: string;
  layout?: LayoutDto;
  data_source?: DataSourceDto;
}

export class AppConfigDto {
  ttl_seconds: number;
  sections: SectionDto[];
}
