import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DriverProfileResponseDto {
  @ApiProperty({ example: 1 })
  driverId!: number;

  @ApiProperty({ example: 'Ahmad Hassan' })
  name!: string;

  @ApiPropertyOptional({ example: '+961' })
  countryCode?: string;

  @ApiPropertyOptional({ example: '71234567' })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'motorcycle' })
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'LB-12345' })
  licensePlate?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/photo.jpg', description: 'Profile photo presigned URL' })
  profilePhotoUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/license.jpg', description: 'Driver license presigned URL' })
  licenseUrl?: string;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/insurance.jpg', description: 'Insurance presigned URL' })
  insuranceUrl?: string;

  @ApiProperty({ example: 'offline', enum: ['online', 'busy', 'offline'] })
  availabilityStatus!: string;

  @ApiPropertyOptional({ example: 4.8 })
  averageRating?: number;

  @ApiPropertyOptional({ example: 152 })
  totalDeliveries?: number;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00.000Z' })
  joinedAt?: string;
}
