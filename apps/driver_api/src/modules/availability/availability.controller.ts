import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { AvailabilityService } from './availability.service';
import { UpdateAvailabilityDto, UpdateLocationDto } from './dto/update-availability.dto';

@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Get current availability status and location' })
  @ApiResponse({ status: 200, description: 'Current driver status returned.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getStatus(@Request() req: any) {
    return this.availabilityService.getStatus(req.user.userId);
  }

  @Patch('status')
  @ApiOperation({ summary: 'Set availability status (online / busy / offline)' })
  @ApiResponse({ status: 200, description: 'Status updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async setAvailability(@Request() req: any, @Body() dto: UpdateAvailabilityDto) {
    await this.availabilityService.setAvailability(req.user.userId, dto);
  }

  @Patch('location')
  @ApiOperation({ summary: 'Update driver GPS location' })
  @ApiResponse({ status: 200, description: 'Location updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateLocation(@Request() req: any, @Body() dto: UpdateLocationDto) {
    await this.availabilityService.updateLocation(req.user.userId, dto);
  }
}
