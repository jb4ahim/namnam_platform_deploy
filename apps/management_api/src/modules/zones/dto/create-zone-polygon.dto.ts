import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CoordinateDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

export class CreateZonePolygonDto {
  @IsNumber()
  @IsNotEmpty()
  zoneId: number;

  @IsArray()
  @ArrayMinSize(3) // Minimum 3 points for a polygon
  @ValidateNested({ each: true })
  @Type(() => CoordinateDto)
  coordinates: CoordinateDto[];
}
