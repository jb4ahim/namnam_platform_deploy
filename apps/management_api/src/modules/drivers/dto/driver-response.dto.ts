import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDriverResponseDto {
  @ApiProperty({ example: 5 })
  driverId!: number;

  @ApiProperty({ example: 'Ahmad Hassan' })
  name!: string;

  @ApiProperty({ example: '+961' })
  countryCode!: string;

  @ApiProperty({ example: '71234567' })
  phoneNumber!: string;

  @ApiPropertyOptional({ example: 'motorcycle' })
  vehicleType?: string;

  @ApiPropertyOptional({ example: 'LB-12345' })
  licensePlate?: string;

  @ApiProperty({ example: 'Xk9#mP2@qL4!', description: 'Temporary password — shown once, share securely with driver' })
  temporaryPassword!: string;
}

export class DriverListItemDto {
  @ApiProperty({ example: 5 })
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

  @ApiProperty({ example: 'offline', enum: ['online', 'busy', 'offline'] })
  availabilityStatus!: string;

  @ApiProperty({ example: true, description: 'True if driver has not yet changed their temporary password' })
  firstLogin!: boolean;

  @ApiProperty({ example: 'active', enum: ['active', 'inactive', 'suspended'] })
  status!: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00.000Z' })
  createdAt?: string;
}

export class UpdateDriverStatusDto {
  @ApiProperty({ example: 'suspended', enum: ['active', 'inactive', 'suspended'] })
  status!: string;
}
