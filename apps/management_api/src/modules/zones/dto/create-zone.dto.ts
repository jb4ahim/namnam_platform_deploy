import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateZoneDto {
  @ApiProperty({ description: 'The name of the delivery or service zone', example: 'Downtown Dubai' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  zoneName: string;

  @ApiPropertyOptional({ description: 'Extra details or description about the zone', example: 'Business bay and surrounding areas' })
  @IsString()
  @IsOptional()
  zoneDescription?: string;
}
