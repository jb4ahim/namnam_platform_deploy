import { Controller, Post, Get, Patch, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { CreateDriverResponseDto, DriverListItemDto } from './dto/driver-response.dto';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new driver account with a temporary password' })
  @ApiResponse({ status: 201, description: 'Driver created. Temporary password shown once.', type: CreateDriverResponseDto })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async createDriver(@Body() dto: CreateDriverDto): Promise<CreateDriverResponseDto> {
    return this.driversService.createDriver(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all drivers' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by name or phone' })
  @ApiResponse({ status: 200, description: 'List of drivers.', type: [DriverListItemDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async listDrivers(@Query('search') search?: string): Promise<DriverListItemDto[]> {
    return this.driversService.listDrivers(search);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get driver details' })
  @ApiResponse({ status: 200, description: 'Driver details.', type: DriverListItemDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async getDriver(@Param('id', ParseIntPipe) id: number): Promise<DriverListItemDto> {
    return this.driversService.getDriverById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update driver status (active / inactive / suspended)' })
  @ApiResponse({ status: 200, description: 'Status updated.', type: DriverListItemDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDriverStatusDto,
  ): Promise<DriverListItemDto> {
    return this.driversService.updateDriverStatus(id, dto);
  }
}
