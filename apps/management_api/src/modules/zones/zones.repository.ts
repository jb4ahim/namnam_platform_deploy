import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZonePolygonDto } from './dto/create-zone-polygon.dto';
import { CreateMultipleZonePolygonsDto } from './dto/create-multiple-zone-polygons.dto';

export type Zone = {
  zoneId: number;
  zoneName: string;
  zoneDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ZonePolygon = {
  polygonId: number;
  zoneId: number;
  polygon: string; // GeoJSON or WKT format
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class ZonesRepository {
  constructor(private readonly pg: PostgresService) {}

  async getAllZones(): Promise<Zone[]> {
    const result = await DatabaseUtils.callFunction<Zone[] | Zone>(
      this.pg,
      'select_zones',
      [],
      false
    );
    return (result as Zone[]) ?? [];
  }

  async getZoneById(id: number): Promise<Zone | null> {
    const result = await DatabaseUtils.callFunction<Zone>(
      this.pg,
      'select_zone_by_id',
      [id],
      false
    );
    return (result as Zone) || null;
  }

  async createZone(dto: CreateZoneDto): Promise<void> {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'create_zone',
      [dto.zoneName, dto.zoneDescription ?? null]
    );
  }

  async updateZone(dto: UpdateZoneDto): Promise<void> {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_zone',
      [dto.id, dto.zoneName ?? null, dto.zoneDescription ?? null],
    );
  }

  async deleteZone(id: number): Promise<void> {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_zone',
      [id],
    );
  }

  async getZonePolygons(zoneId: number): Promise<ZonePolygon[]> {
    const result = await DatabaseUtils.callFunction<ZonePolygon[] | ZonePolygon>(
      this.pg,
      'select_zone_polygons',
      [zoneId],
      false
    );
    return (result as ZonePolygon[]) ?? [];
  }

  async createZonePolygon(dto: CreateZonePolygonDto): Promise<ZonePolygon> {
    // Convert coordinates to WKT POLYGON format
    const coordinatesWKT = dto.coordinates
      .map(coord => `${coord.longitude} ${coord.latitude}`)
      .join(', ');
    const polygonWKT = `POLYGON((${coordinatesWKT}, ${dto.coordinates[0].longitude} ${dto.coordinates[0].latitude}))`;

    const result = await DatabaseUtils.callFunction<ZonePolygon>(
      this.pg,
      'create_zone_polygon',
      [dto.zoneId, polygonWKT],
      false
    );
    if (!result) {
      throw new Error('Failed to create zone polygon');
    }
    return result as ZonePolygon;
  }

  async createMultipleZonePolygons(dto: CreateMultipleZonePolygonsDto): Promise<ZonePolygon[]> {
    // Convert all polygons to WKT format
    const polygonWKTs: string[] = dto.polygons.map(polygon => {
      const coordinatesWKT = polygon.coordinates
        .map(coord => `${coord.longitude} ${coord.latitude}`)
        .join(', ');
      return `POLYGON((${coordinatesWKT}, ${polygon.coordinates[0].longitude} ${polygon.coordinates[0].latitude}))`;
    });

    // Use the stored procedure to create multiple polygons at once
    await DatabaseUtils.callProcedure(
      this.pg,
      'create_zone_polygons',
      [dto.zoneId, polygonWKTs]
    );

    // Return the newly created polygons for this zone
    return this.getZonePolygons(dto.zoneId);
  }

  async deleteZonePolygon(polygonId: number): Promise<boolean> {
    const result = await DatabaseUtils.callFunction<{ success: boolean }>(
      this.pg,
      'delete_zone_polygon',
      [polygonId],
      false
    );
    return (result as { success: boolean })?.success ?? false;
  }
}
