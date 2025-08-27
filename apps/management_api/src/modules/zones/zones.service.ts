import { Injectable } from '@nestjs/common';
import { ZonesRepository } from './zones.repository';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZonePolygonDto } from './dto/create-zone-polygon.dto';
import { CreateMultipleZonePolygonsDto } from './dto/create-multiple-zone-polygons.dto';

@Injectable()
export class ZonesService {
  constructor(private readonly zonesRepository: ZonesRepository) {}

  async getAll() {
    return this.zonesRepository.getAllZones();
  }

  async getById(id: number) {
    return this.zonesRepository.getZoneById(id);
  }

  async create(dto: CreateZoneDto) {
    return this.zonesRepository.createZone(dto);
  }

  async update(id: number, dto: UpdateZoneDto) {
    return this.zonesRepository.updateZone(id, dto);
  }

  async delete(id: number) {
    return this.zonesRepository.deleteZone(id);
  }

  async getZonePolygons(zoneId: number) {
    return this.zonesRepository.getZonePolygons(zoneId);
  }

  async createZonePolygon(dto: CreateZonePolygonDto) {
    return this.zonesRepository.createZonePolygon(dto);
  }

  async createMultipleZonePolygons(dto: CreateMultipleZonePolygonsDto) {
    return this.zonesRepository.createMultipleZonePolygons(dto);
  }

  async deleteZonePolygon(polygonId: number) {
    return this.zonesRepository.deleteZonePolygon(polygonId);
  }
}
