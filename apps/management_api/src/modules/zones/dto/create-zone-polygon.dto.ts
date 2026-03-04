import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class CoordinateDto {
  @ApiProperty({ description: 'Longitude coordinate', example: 55.2708 })
  @IsNumber()
  longitude: number;

  @ApiProperty({ description: 'Latitude coordinate', example: 25.2048 })
  @IsNumber()
  latitude: number;
}

export class CreateZonePolygonDto {
  @ApiProperty({ description: 'The ID of the zone this polygon belongs to', example: 1 })
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @ApiProperty({ description: 'List of lat/long coordinates making up the polygon (must close the shape)', type: [CoordinateDto] })
  @IsArray()
  @ArrayMinSize(3) // Minimum 3 points for a polygon
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto[];
}
