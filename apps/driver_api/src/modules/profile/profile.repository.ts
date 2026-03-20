import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(driverId: number) {
    return this.prisma.users.findUnique({
      where: { user_id: driverId },
      select: {
        user_id: true,
        name: true,
        country_code: true,
        phone_number: true,
        created_at: true,
        driver_profiles: {
          select: {
            vehicle_type: true,
            license_plate: true,
            profile_photo_key: true,
            license_key: true,
            insurance_key: true,
            availability_status: true,
          },
        },
        driver_performance: {
          select: { average_rating: true, orders_completed: true },
          orderBy: { last_updated: 'desc' },
          take: 1,
        },
      },
    });
  }

  async updateProfile(driverId: number, dto: UpdateProfileDto) {
    const updates: Promise<unknown>[] = [];

    if (dto.firstName !== undefined || dto.lastName !== undefined) {
      updates.push(
        this.prisma.users.update({
          where: { user_id: driverId },
          data: {
            name: [dto.firstName, dto.lastName].filter(Boolean).join(' ') || undefined,
          },
        }),
      );
    }

    if (dto.vehicleType !== undefined || dto.licensePlate !== undefined || dto.fcmToken !== undefined) {
      updates.push(
        this.prisma.driver_profiles.upsert({
          where: { driver_id: driverId },
          create: {
            driver_id: driverId,
            vehicle_type: dto.vehicleType,
            license_plate: dto.licensePlate,
            fcm_token: dto.fcmToken,
          },
          update: {
            vehicle_type: dto.vehicleType ?? undefined,
            license_plate: dto.licensePlate ?? undefined,
            fcm_token: dto.fcmToken ?? undefined,
            updated_at: new Date(),
          },
        }),
      );
    }

    await Promise.all(updates);
  }

  async updateDocumentKey(driverId: number, field: 'profile_photo_key' | 'license_key' | 'insurance_key', key: string) {
    await this.prisma.driver_profiles.upsert({
      where: { driver_id: driverId },
      create: { driver_id: driverId, [field]: key },
      update: { [field]: key, updated_at: new Date() },
    });
  }

  async getPasswordHash(driverId: number): Promise<{ password_hash: string | null } | null> {
    return this.prisma.driver_profiles.findUnique({
      where: { driver_id: driverId },
      select: { password_hash: true },
    });
  }

  async changePassword(driverId: number, newPasswordHash: string) {
    await this.prisma.driver_profiles.upsert({
      where: { driver_id: driverId },
      create: { driver_id: driverId, password_hash: newPasswordHash, first_login: false },
      update: { password_hash: newPasswordHash, first_login: false, updated_at: new Date() },
    });
  }
}
