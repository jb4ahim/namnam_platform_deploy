import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDriverDto {
  @ApiProperty({ description: 'Driver first name', example: 'Ahmad' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Driver last name', example: 'Hassan' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ description: 'Vehicle type', example: 'motorcycle', enum: ['motorcycle', 'car', 'bicycle', 'van'] })
  @IsOptional()
  @IsString()
  vehicleType?: string;

  @ApiPropertyOptional({ description: 'License plate number', example: 'LB-12345' })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z0-9\-]{2,15}$/, { message: 'Invalid license plate format' })
  licensePlate?: string;

  @ApiProperty({ description: 'Verification token received after OTP validation', example: 'uuid-token-here' })
  @IsString()
  @IsNotEmpty({ message: 'Verification token is required' })
  verifyToken!: string;
}
