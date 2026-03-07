import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MerchantListItemDto {
  @ApiProperty({ example: 45 })
  id: number;

  @ApiPropertyOptional({ example: 'RAED' })
  name?: string;

  @ApiPropertyOptional({ example: 'merchant@example.com' })
  email?: string;

  @ApiProperty({ example: '76123456' })
  phone_number: string;

  @ApiProperty({ example: '2025-10-31T15:21:23.979Z' })
  created_at: string;
}

export class PaginatedMerchantsDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 20 })
  page_size: number;

  @ApiProperty({ example: 61 })
  total_count: number;

  @ApiProperty({ example: 4 })
  total_pages: number;

  @ApiProperty({ type: [MerchantListItemDto] })
  items: MerchantListItemDto[];
}

export class MerchantCategoryDto {
  @ApiProperty({ example: 20 })
  categoryId: number;

  @ApiProperty({ example: 'Tech Store' })
  categoryName: string;
}

export class MerchantDetailedInfoDto {
  @ApiProperty({ example: 45 })
  merchantId: number;

  @ApiProperty({ example: 'RAED' })
  name: string;

  @ApiPropertyOptional({ example: 'Techy' })
  description?: string;

  @ApiPropertyOptional({ example: '+96176123698' })
  hotline?: string;

  @ApiPropertyOptional({ example: 'uploads/2025-10-31/logo.png' })
  logoKey?: string;

  @ApiPropertyOptional({ example: 'uploads/2025-10-31/cover.jpg' })
  coverKey?: string;

  @ApiProperty({ example: 33.8935 })
  latitude: number;

  @ApiProperty({ example: 35.5018 })
  longitude: number;

  @ApiProperty({ example: '2025-10-31T15:21:23.979Z' })
  createdAt: string;

  @ApiProperty({ example: false })
  isOwnedByApp: boolean;

  @ApiProperty({ type: MerchantCategoryDto })
  category: MerchantCategoryDto;
}

export class MerchantScheduleItemDto {
  @ApiProperty({ example: 113 })
  scheduleId: number;

  @ApiProperty({ example: 'monday', enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] })
  dayOfWeek: string;

  @ApiPropertyOptional({ example: '05:00:00' })
  openTime?: string;

  @ApiPropertyOptional({ example: '08:00:00' })
  closeTime?: string;

  @ApiProperty({ example: false })
  isClosed: boolean;
}

export class MerchantLocationDto {
  @ApiProperty({ example: 33.8935 })
  latitude: number;

  @ApiProperty({ example: 35.5018 })
  longitude: number;

  @ApiPropertyOptional({ example: 'hdbd' })
  street?: string;

  @ApiPropertyOptional({ example: 'hrbr' })
  building?: string;

  @ApiPropertyOptional({ example: 'Heheh' })
  notes?: string;

  @ApiProperty({ type: [String], example: [] })
  buildingImages: string[];
}

export class MerchantRequestLocationDto {
  @ApiProperty({ example: 33.8935 })
  latitude: number;

  @ApiProperty({ example: 35.5018 })
  longitude: number;

  @ApiPropertyOptional({ example: 'Hamra Street' })
  street?: string;

  @ApiPropertyOptional({ example: 'Tower 15' })
  building?: string;
}

export class MerchantRequestMediaDto {
  @ApiPropertyOptional({ example: 'uploads/2026-03-05/logo.jpg' })
  logoKey?: string;

  @ApiPropertyOptional({ example: 'uploads/2026-03-05/cover.jpg' })
  coverKey?: string;
}

export class MerchantRequestContactDto {
  @ApiPropertyOptional({ example: '+96171252525' })
  hotlineNumber?: string;
}

export class MerchantRequestMerchantDto {
  @ApiProperty({ example: 67 })
  merchantId: number;

  @ApiProperty({ example: 'hbn' })
  name: string;

  @ApiPropertyOptional({ example: 'bn' })
  description?: string;

  @ApiProperty({ example: 17 })
  categoryId: number;

  @ApiProperty({ example: false })
  isOwnedByApp: boolean;

  @ApiPropertyOptional({ example: 'Tayouneh\nBeirut, Lebanon' })
  notes?: string;

  @ApiProperty({ example: '2026-03-05T17:51:48.525Z' })
  merchantCreatedAt: string;

  @ApiProperty({ type: MerchantRequestMediaDto })
  media: MerchantRequestMediaDto;

  @ApiProperty({ type: MerchantRequestContactDto })
  contact: MerchantRequestContactDto;

  @ApiProperty({ type: MerchantRequestLocationDto })
  location: MerchantRequestLocationDto;
}

export class MerchantRequestDto {
  @ApiProperty({ example: 11 })
  requestId: number;

  @ApiProperty({ example: 'pending', enum: ['pending', 'approved', 'rejected'] })
  status: string;

  @ApiPropertyOptional({ example: 3 })
  zoneId?: number;

  @ApiProperty({ example: '2026-03-05T18:12:39.684Z' })
  requestCreatedAt: string;

  @ApiProperty({ type: MerchantRequestMerchantDto })
  merchant: MerchantRequestMerchantDto;
}
