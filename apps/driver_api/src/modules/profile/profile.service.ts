import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DriverProfileResponseDto } from './dto/profile-response.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async getProfile(driverId: number): Promise<DriverProfileResponseDto> {
    const user = await this.repo.getProfile(driverId);
    if (!user) throw new NotFoundException('Driver not found');

    const perf = user.driver_performance[0];

    return {
      driverId: user.user_id,
      name: user.name ?? '',
      countryCode: user.country_code ?? undefined,
      phoneNumber: user.phone_number ?? undefined,
      vehicleType: user.driver_profiles?.vehicle_type ?? undefined,
      licensePlate: user.driver_profiles?.license_plate ?? undefined,
      availabilityStatus: user.driver_profiles?.availability_status ?? 'offline',
      averageRating: perf?.average_rating ? Number(perf.average_rating) : undefined,
      totalDeliveries: perf?.orders_completed ?? undefined,
      joinedAt: user.created_at?.toISOString(),
    };
  }

  async updateProfile(driverId: number, dto: UpdateProfileDto) {
    await this.repo.updateProfile(driverId, dto);
  }
}
