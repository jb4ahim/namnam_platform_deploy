import { IsOptional, IsString, MaxLength, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateZoneDto {
  @ApiProperty({ description: 'ID of the zone to update', example: 1 })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiPropertyOptional({ description: 'The name of the delivery or service zone', example: 'Downtown Dubai' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  zoneName?: string;

  @ApiPropertyOptional({ description: 'Extra details or description about the zone', example: 'Business bay and surrounding areas' })
  @IsString()
  @IsOptional()
  zoneDescription?: string;
}
