import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { status_type } from '@app/database';
import { DriversRepository } from './drivers.repository';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { CreateDriverResponseDto, DriverListItemDto } from './dto/driver-response.dto';

@Injectable()
export class DriversService {
  constructor(private readonly repo: DriversRepository) {}

  async createDriver(dto: CreateDriverDto): Promise<CreateDriverResponseDto> {
    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await bcrypt.hash(temporaryPassword, 10);

    const { user, profile } = await this.repo.createDriver({
      firstName: dto.firstName,
      lastName: dto.lastName,
      countryCode: dto.countryCode,
      phoneNumber: dto.phoneNumber,
      vehicleType: dto.vehicleType,
      licensePlate: dto.licensePlate,
      passwordHash,
    });

    return {
      driverId: user.user_id,
      name: user.name ?? '',
      countryCode: user.country_code ?? dto.countryCode,
      phoneNumber: user.phone_number ?? dto.phoneNumber,
      vehicleType: profile.vehicle_type ?? undefined,
      licensePlate: profile.license_plate ?? undefined,
      temporaryPassword,
    };
  }

  async listDrivers(search?: string): Promise<DriverListItemDto[]> {
    const drivers = await this.repo.listDrivers(search);
    return drivers.map((d) => ({
      driverId: d.user_id,
      name: d.name ?? '',
      countryCode: d.country_code ?? undefined,
      phoneNumber: d.phone_number ?? undefined,
      vehicleType: d.driver_profiles?.vehicle_type ?? undefined,
      licensePlate: d.driver_profiles?.license_plate ?? undefined,
      availabilityStatus: d.driver_profiles?.availability_status ?? 'offline',
      firstLogin: d.driver_profiles?.first_login ?? true,
      status: d.driver_profiles?.status ?? 'active',
      createdAt: d.created_at?.toISOString(),
    }));
  }

  async getDriverById(driverId: number): Promise<DriverListItemDto> {
    const d = await this.repo.getDriverById(driverId);
    if (!d) throw new NotFoundException('Driver not found');

    const perf = d.driver_performance?.[0];
    return {
      driverId: d.user_id,
      name: d.name ?? '',
      countryCode: d.country_code ?? undefined,
      phoneNumber: d.phone_number ?? undefined,
      vehicleType: d.driver_profiles?.vehicle_type ?? undefined,
      licensePlate: d.driver_profiles?.license_plate ?? undefined,
      availabilityStatus: d.driver_profiles?.availability_status ?? 'offline',
      firstLogin: d.driver_profiles?.first_login ?? true,
      status: d.driver_profiles?.status ?? 'active',
      createdAt: d.created_at?.toISOString(),
    };
  }

  async updateDriverStatus(driverId: number, dto: UpdateDriverStatusDto): Promise<DriverListItemDto> {
    const exists = await this.repo.getDriverById(driverId);
    if (!exists) throw new NotFoundException('Driver not found');

    const updated = await this.repo.updateDriverStatus(driverId, dto.status as status_type);
    return this.getDriverById(driverId);
  }

  private generateTemporaryPassword(): string {
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghjkmnpqrstuvwxyz';
    const digits = '23456789';
    const special = '@#$!';
    const all = upper + lower + digits + special;

    // Guarantee at least one of each character class
    const password = [
      upper[Math.floor(Math.random() * upper.length)],
      lower[Math.floor(Math.random() * lower.length)],
      digits[Math.floor(Math.random() * digits.length)],
      special[Math.floor(Math.random() * special.length)],
      ...Array.from({ length: 8 }, () => all[Math.floor(Math.random() * all.length)]),
    ];

    // Shuffle
    return password.sort(() => Math.random() - 0.5).join('');
  }
}
