import { Injectable } from '@nestjs/common';
import { driver_availability_status, PrismaService } from '@app/database';

@Injectable()
export class AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async setAvailability(driverId: number, status: driver_availability_status) {
    await this.prisma.driver_profiles.upsert({
      where: { driver_id: driverId },
      create: { driver_id: driverId, availability_status: status },
      update: { availability_status: status, updated_at: new Date() },
    });
  }

  async updateLocation(driverId: number, latitude: number, longitude: number) {
    await this.prisma.driver_profiles.upsert({
      where: { driver_id: driverId },
      create: { driver_id: driverId, last_latitude: latitude, last_longitude: longitude },
      update: { last_latitude: latitude, last_longitude: longitude, updated_at: new Date() },
    });
  }

  async getStatus(driverId: number) {
    const profile = await this.prisma.driver_profiles.findUnique({
      where: { driver_id: driverId },
      select: { availability_status: true, last_latitude: true, last_longitude: true },
    });
    return profile;
  }
}
