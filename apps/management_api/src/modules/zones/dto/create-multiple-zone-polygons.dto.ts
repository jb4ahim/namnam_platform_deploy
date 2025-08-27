import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

class PolygonDto {
  @IsArray()
  @ArrayMinSize(3) // Minimum 3 points for a polygon
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto[];
}

export class CreateMultipleZonePolygonsDto {
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @IsArray()
  @ArrayMinSize(1) // At least one polygon
  @ValidateNested({ each: true })
  @Type(() => PolygonDto)
  polygons: PolygonDto[];
}
