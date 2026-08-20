import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { CreateZonePolygonDto } from './dto/create-zone-polygon.dto';
import { CreateMultipleZonePolygonsDto } from './dto/create-multiple-zone-polygons.dto';
import { ZoneDto, ZonePolygonDto } from './dto/zone-response.dto';
import { AuthGuard } from '@app/auth';

@ApiTags('Zones')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all zones' })
  @ApiResponse({ status: 200, type: [ZoneDto], description: 'List of zones' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAll() {
    return this.zonesService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: ZoneDto, description: 'Zone details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Zone not found' })
  async getById(@Param('id') id: string) {
    return this.zonesService.getById(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a zone' })
  @ApiResponse({ status: 201, type: ZoneDto, description: 'Zone created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() dto: CreateZoneDto) {
    return this.zonesService.create(dto);
  }

  @Patch('updateZones')
  @ApiOperation({ summary: 'Update a zone' })
  @ApiBody({ type: UpdateZoneDto })
  @ApiResponse({ status: 200, type: ZoneDto, description: 'Zone updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Zone not found' })
  async update(@Body() dto: UpdateZoneDto) {
    return this.zonesService.update(dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a zone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Zone deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async delete(@Param('id') id: string) {
    return this.zonesService.delete(+id);
  }

  @Get(':id/polygons')
  @ApiOperation({ summary: 'Get polygons for a zone' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, type: [ZonePolygonDto], description: 'Zone polygons' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getZonePolygons(@Param('id') id: string) {
    return this.zonesService.getZonePolygons(+id);
  }

  @Post('polygons')
  @ApiOperation({ summary: 'Create a zone polygon' })
  @ApiResponse({ status: 201, type: ZonePolygonDto, description: 'Polygon created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createZonePolygon(@Body() dto: CreateZonePolygonDto) {
    return this.zonesService.createZonePolygon(dto);
  }

  @Post('polygons/multiple')
  @ApiOperation({ summary: 'Create multiple zone polygons' })
  @ApiResponse({ status: 201, description: 'Polygons created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createMultipleZonePolygons(@Body() dto: CreateMultipleZonePolygonsDto) {
    return this.zonesService.createMultipleZonePolygons(dto);
  }

  @Delete('polygons/:polygonId')
  @ApiOperation({ summary: 'Delete a zone polygon' })
  @ApiParam({ name: 'polygonId', type: Number })
  @ApiResponse({ status: 200, description: 'Polygon deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteZonePolygon(@Param('polygonId') polygonId: string) {
    return this.zonesService.deleteZonePolygon(+polygonId);
  }
}
