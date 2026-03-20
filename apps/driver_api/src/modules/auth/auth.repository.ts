import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveOtpPhone(countryCode: string, phoneNumber: string, otp: string) {
    return this.prisma.user_otp.create({
      data: {
        destination: countryCode + phoneNumber,
        method: 'phone',
        otp_code: otp,
        expires_at: new Date(Date.now() + 15 * 60 * 1000),
      },
    });
  }

  async verifyOtp(destination: string, code: string): Promise<boolean> {
    const otpRecord = await this.prisma.user_otp.findFirst({
      where: {
        destination,
        method: 'phone',
        otp_code: code,
        is_used: false,
        expires_at: { gt: new Date() },
      },
    });

    if (!otpRecord) return false;

    await this.prisma.user_otp.update({
      where: { user_otp_id: otpRecord.user_otp_id },
      data: { is_used: true },
    });

    return true;
  }

  async findDriverByPhone(countryCode: string, phoneNumber: string): Promise<number | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        country_code: countryCode,
        phone_number: phoneNumber,
        user_type: 'driver',
      },
      select: { user_id: true },
    });
    return user?.user_id ?? null;
  }

  async createDriverWithPhone(
    countryCode: string,
    phoneNumber: string,
    firstName: string,
    lastName: string,
  ): Promise<number> {
    const user = await this.prisma.users.create({
      data: {
        country_code: countryCode,
        phone_number: phoneNumber,
        name: `${firstName} ${lastName}`,
        user_type: 'driver',
      },
    });
    return user.user_id;
  }

  async createDriverProfile(
    driverId: number,
    vehicleType?: string,
    licensePlate?: string,
  ) {
    return this.prisma.driver_profiles.upsert({
      where: { driver_id: driverId },
      create: {
        driver_id: driverId,
        vehicle_type: vehicleType,
        license_plate: licensePlate,
        availability_status: 'offline',
      },
      update: {
        vehicle_type: vehicleType ?? undefined,
        license_plate: licensePlate ?? undefined,
      },
    });
  }

  async findDriverWithProfile(countryCode: string, phoneNumber: string) {
    return this.prisma.users.findFirst({
      where: { country_code: countryCode, phone_number: phoneNumber, user_type: 'driver' },
      select: {
        user_id: true,
        driver_profiles: {
          select: {
            password_hash: true,
            first_login: true,
            status: true,
          },
        },
      },
    });
  }
}
