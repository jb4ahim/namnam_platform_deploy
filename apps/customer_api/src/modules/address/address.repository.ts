import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressRepository {
  constructor(private readonly pg: PostgresService) {}

  async list(customerId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_customer_addresses',
      [customerId],
      false
    );
    return result || [];
  }

  async getById(addressId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_customer_address_by_id',
      [addressId],
      false
    );
    return result || null;
  }

  async create(userId: number, dto: CreateAddressDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'create_customer_address',
      [
        userId,
        dto.label,
        dto.addressLine1,
        dto.city,
        dto.state,
        dto.addressLine2 ?? null,
        dto.country ?? null,
        dto.apartment ?? null,
        dto.building ?? null,
        dto.latitude ?? null,
        dto.longitude ?? null,
        dto.isDefault ?? false,
        dto.status ?? 'active',
      ]
    );
  }

  async update(userId: number, addressId: number, dto: UpdateAddressDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_customer_address',
      [
        userId,
        addressId,
        dto.label ?? null,
        dto.addressLine1 ?? null,
        dto.addressLine2 ?? null,
        dto.city ?? null,
        dto.state ?? null,
        dto.country ?? null,
        dto.apartment ?? null,
        dto.building ?? null,
        dto.latitude ?? null,
        dto.longitude ?? null,
        dto.isDefault ?? null,
        dto.status ?? null
      ]
    );
  }

  async delete(userId: number, addressId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_customer_address',
      [userId, addressId]
    );
    return { success: true, message: 'Address deleted successfully' };
  }

  async getAllowedZones() {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_allowed_address_zones',
      [],
      false
    );
    return result;
  }
}
