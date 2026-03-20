import { Injectable } from '@nestjs/common';
import { PrismaService, status_type } from '@app/database';

@Injectable()
export class DriversRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDriver(params: {
    firstName: string;
    lastName: string;
    countryCode: string;
    phoneNumber: string;
    vehicleType?: string;
    licensePlate?: string;
    passwordHash: string;
  }) {
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.users.create({
        data: {
          name: `${params.firstName} ${params.lastName}`,
          country_code: params.countryCode,
          phone_number: params.phoneNumber,
          user_type: 'driver',
        },
      });

      const profile = await tx.driver_profiles.create({
        data: {
          driver_id: user.user_id,
          vehicle_type: params.vehicleType,
          license_plate: params.licensePlate,
          password_hash: params.passwordHash,
          availability_status: 'offline',
          first_login: true,
          status: 'active',
        },
      });

      return { user, profile };
    });
  }

  async listDrivers(search?: string) {
    return this.prisma.users.findMany({
      where: {
        user_type: 'driver',
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { phone_number: { contains: search } },
              ],
            }
          : {}),
      },
      orderBy: { created_at: 'desc' },
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
            availability_status: true,
            first_login: true,
            status: true,
          },
        },
      },
    });
  }

  async getDriverById(driverId: number) {
    return this.prisma.users.findFirst({
      where: { user_id: driverId, user_type: 'driver' },
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
            availability_status: true,
            first_login: true,
            status: true,
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

  async updateDriverStatus(driverId: number, status: status_type) {
    await this.prisma.driver_profiles.updateMany({
      where: { driver_id: driverId },
      data: { status, updated_at: new Date() },
    });

    return this.getDriverById(driverId);
  }
}
