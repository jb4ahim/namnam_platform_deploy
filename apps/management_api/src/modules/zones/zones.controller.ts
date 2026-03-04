import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZonePolygonDto } from './dto/create-zone-polygon.dto';
import { CreateMultipleZonePolygonsDto } from './dto/create-multiple-zone-polygons.dto';
import { AuthGuard } from '@app/auth';

@ApiTags('Zones')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all zones' })
  async getAll() {
    return this.zonesService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by ID' })
  async getById(@Param('id') id: string) {
    return this.zonesService.getById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a zone' })
  async create(@Body() dto: CreateZoneDto) {
    return this.zonesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a zone' })
  async update(@Param('id') id: string, @Body() dto: UpdateZoneDto) {
    return this.zonesService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a zone' })
  async delete(@Param('id') id: string) {
    return this.zonesService.delete(+id);
  }

  @Get(':id/polygons')
  @ApiOperation({ summary: 'Get polygons for a zone' })
  async getZonePolygons(@Param('id') id: string) {
    return this.zonesService.getZonePolygons(+id);
  }

  @Post('polygons')
  @ApiOperation({ summary: 'Create a zone polygon' })
  async createZonePolygon(@Body() dto: CreateZonePolygonDto) {
    return this.zonesService.createZonePolygon(dto);
  }

  @Post('polygons/multiple')
  @ApiOperation({ summary: 'Create multiple zone polygons' })
  async createMultipleZonePolygons(@Body() dto: CreateMultipleZonePolygonsDto) {
    return this.zonesService.createMultipleZonePolygons(dto);
  }

  @Delete('polygons/:polygonId')
  @ApiOperation({ summary: 'Delete a zone polygon' })
  async deleteZonePolygon(@Param('polygonId') polygonId: string) {
    return this.zonesService.deleteZonePolygon(+polygonId);
  }
}
