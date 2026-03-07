import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MerchantCategoryDto {
  @ApiProperty({ example: 14 })
  categoryId: number;

  @ApiProperty({ example: 'Burgers' })
  categoryName: string;
}

export class OnboardingStepDto {
  @ApiProperty({ example: 'merchantInfo', description: 'Step name', enum: ['merchantInfo', 'contactPerson', 'merchantLocation', 'merchantSchedule'] })
  step: string;

  @ApiProperty({ example: true })
  isCompleted: boolean;
}

export class MerchantInfoResponseDto {
  @ApiProperty({ example: 5 })
  merchantId: number;

  @ApiProperty({ example: 'Test Merchant 2' })
  name: string;

  @ApiPropertyOptional({ example: 'A great place for food.' })
  description?: string;

  @ApiPropertyOptional({ example: '+9611234567' })
  hotline?: string;

  @ApiPropertyOptional({ example: 'logos/merchant-5.jpg' })
  logoKey?: string;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/logos/merchant-5.jpg' })
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'covers/merchant-5.jpg' })
  coverKey?: string;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/covers/merchant-5.jpg' })
  coverUrl?: string;

  @ApiProperty({ example: 33.8886 })
  latitude: number;

  @ApiProperty({ example: 35.4955 })
  longitude: number;

  @ApiProperty({ example: '2025-08-23T12:53:17.857' })
  createdAt: string;

  @ApiProperty({ example: false })
  isOwnedByApp: boolean;

  @ApiProperty({ type: MerchantCategoryDto })
  category: MerchantCategoryDto;

  @ApiProperty({ type: [OnboardingStepDto] })
  steps: OnboardingStepDto[];
}

export class ScheduleItemDto {
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

export class ContactPersonResponseDto {
  @ApiProperty({ example: 34 })
  merchantContactPersonId: number;

  @ApiProperty({ example: 45 })
  merchantId: number;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'Manager' })
  role: string;

  @ApiProperty({ example: 'john@example.com' })
  emailAddress: string;
}

export class LocationResponseDto {
  @ApiProperty({ example: 33.8935 })
  latitude: number;

  @ApiProperty({ example: 35.5018 })
  longitude: number;

  @ApiPropertyOptional({ example: 'Main Street' })
  street?: string;

  @ApiPropertyOptional({ example: 'Building A' })
  building?: string;

  @ApiPropertyOptional({ example: 'Ring the bell' })
  notes?: string;

  @ApiProperty({ type: [String], example: [] })
  buildingImages: string[];
}
