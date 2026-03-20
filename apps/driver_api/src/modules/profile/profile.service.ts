import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DriverProfileResponseDto } from './dto/profile-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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

  async changePassword(driverId: number, dto: ChangePasswordDto) {
    const profile = await this.repo.getPasswordHash(driverId);
    if (!profile?.password_hash) {
      throw new UnauthorizedException('No password set on this account');
    }

    const matches = await bcrypt.compare(dto.currentPassword, profile.password_hash);
    if (!matches) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.repo.changePassword(driverId, newHash);
  }
}
