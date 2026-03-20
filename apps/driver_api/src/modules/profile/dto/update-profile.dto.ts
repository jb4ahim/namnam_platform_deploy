import { IsString, IsOptional, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: 'Driver first name', example: 'Ahmad' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Driver last name', example: 'Hassan' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({ description: 'Vehicle type', example: 'motorcycle', enum: ['motorcycle', 'car', 'bicycle', 'van'] })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional({ description: 'License plate number', example: 'LB-12345' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9\-]{2,15}$/, { message: 'Invalid license plate format' })
  licensePlate?: string;

  @ApiPropertyOptional({ description: 'FCM push notification token', example: 'fcm-token-here' })
  @IsOptional()
  @IsString()
  fcmToken?: string;
}
