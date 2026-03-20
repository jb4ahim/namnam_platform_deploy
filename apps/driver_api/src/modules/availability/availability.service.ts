import { Injectable } from '@nestjs/common';
import { driver_availability_status } from '@app/database';
import { AvailabilityRepository } from './availability.repository';
import { UpdateAvailabilityDto, UpdateLocationDto } from './dto/update-availability.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly repo: AvailabilityRepository) {}

  async getStatus(driverId: number) {
    const profile = await this.repo.getStatus(driverId);
    return {
      status: profile?.availability_status ?? 'offline',
      lastLatitude: profile?.last_latitude ? Number(profile.last_latitude) : null,
      lastLongitude: profile?.last_longitude ? Number(profile.last_longitude) : null,
    };
  }

  async setAvailability(driverId: number, dto: UpdateAvailabilityDto) {
    await this.repo.setAvailability(driverId, dto.status as driver_availability_status);
  }

  async updateLocation(driverId: number, dto: UpdateLocationDto) {
    await this.repo.updateLocation(driverId, dto.latitude, dto.longitude);
  }
}
