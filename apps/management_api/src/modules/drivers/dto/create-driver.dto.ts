import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ description: 'Driver first name', example: 'Ahmad' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Driver last name', example: 'Hassan' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiProperty({ description: 'Country code with + prefix', example: '+961' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{1,4}$/, { message: 'Country code must start with + followed by 1-4 digits' })
  countryCode!: string;

  @ApiProperty({ description: 'Phone number without country code', example: '71234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6,15}$/, { message: 'Phone number must be 6-15 digits' })
  phoneNumber!: string;

  @ApiPropertyOptional({ description: 'Vehicle type', example: 'motorcycle', enum: ['motorcycle', 'car', 'bicycle', 'van'] })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional({ description: 'License plate number', example: 'LB-12345' })
  @IsOptional()
  @IsString()
  licensePlate?: string;
}
