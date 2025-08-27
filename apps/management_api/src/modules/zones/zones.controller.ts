import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZonePolygonDto } from './dto/create-zone-polygon.dto';
import { CreateMultipleZonePolygonsDto } from './dto/create-multiple-zone-polygons.dto';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async getAll() {
    return this.zonesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.zonesService.getById(+id);
  }

  @Post()
  async create(@Body() dto: CreateZoneDto) {
    return this.zonesService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.zonesService.update(+id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.zonesService.delete(+id);
  }

  @Get(':id/polygons')
  async getZonePolygons(@Param('id') id: string) {
    return this.zonesService.getZonePolygons(+id);
  }

  @Post('polygons')
  async createZonePolygon(@Body() dto: CreateZonePolygonDto) {
    return this.zonesService.createZonePolygon(dto);
  }

  @Post('polygons/multiple')
  async createMultipleZonePolygons(@Body() dto: CreateMultipleZonePolygonsDto) {
    return this.zonesService.createMultipleZonePolygons(dto);
  }

  @Delete('polygons/:polygonId')
  async deleteZonePolygon(@Param('polygonId') polygonId: string) {
    return this.zonesService.deleteZonePolygon(+polygonId);
  }
}
