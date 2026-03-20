import { IsString, IsNotEmpty, IsIn, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAvailabilityDto {
  @ApiProperty({ description: 'Driver availability status', example: 'online', enum: ['online', 'busy', 'offline'] })
  @IsString()
  @IsNotEmpty()
  @IsIn(['online', 'busy', 'offline'])
  status!: string;

  @ApiPropertyOptional({ description: 'Reason for going offline', example: 'Taking a break', enum: ['taking_a_break', 'vehicle_issue', 'low_battery', 'personal_reason', 'end_shift'] })
  @IsOptional()
  @IsString()
  offlineReason?: string;
}

export class UpdateLocationDto {
  @ApiProperty({ description: 'Driver latitude', example: 33.8938 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @ApiProperty({ description: 'Driver longitude', example: 35.5018 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;
}
