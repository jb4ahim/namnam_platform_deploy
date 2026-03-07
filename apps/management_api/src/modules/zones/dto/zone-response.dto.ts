import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ZoneDto {
  @ApiProperty({ example: 5 })
  zone_id: number;

  @ApiProperty({ example: 'Tripoli' })
  zone_name: string;

  @ApiPropertyOptional({ example: 'Main Tripoli Zone' })
  zone_description?: string;

  @ApiProperty({ example: '2025-08-27T19:39:56.715Z' })
  created_at: string;

  @ApiProperty({ example: '2025-08-27T19:39:56.715Z' })
  updated_at: string;
}

export class ZonePolygonDto {
  @ApiProperty({ example: 1 })
  polygon_id: number;

  @ApiProperty({ example: 5 })
  zone_id: number;

  @ApiProperty({ description: 'Polygon geometry (PostGIS)', example: '((35.5,33.8),(35.6,33.9),(35.5,33.9))' })
  polygon: string;

  @ApiProperty({ example: '2025-08-27T19:39:56.715Z' })
  created_at: string;

  @ApiProperty({ example: '2025-08-27T19:39:56.715Z' })
  updated_at: string;
}
