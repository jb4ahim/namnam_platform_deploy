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
      'get_customer_addresses',
      [customerId],
      true
    );
    return result || [];
  }

  async getById(addressId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'get_customer_address_by_id',
      [addressId],
      false
    );
    return result || null;
  }

  async create(dto: CreateAddressDto) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_customer_address',
      [
        dto.customerId,
        dto.label ?? null,
        dto.addressLine1,
        dto.addressLine2 ?? null,
        dto.city,
        dto.state ?? null,
        dto.postalCode ?? null,
        dto.country,
        dto.latitude ?? null,
        dto.longitude ?? null,
        dto.isDefault ?? null,
        dto.status ?? null,
      ]
    );
    return result;
  }

  async update(addressId: number, dto: UpdateAddressDto) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'update_customer_address',
      [
        addressId,
        dto.customerId ?? null,
        dto.label ?? null,
        dto.addressLine1 ?? null,
        dto.addressLine2 ?? null,
        dto.city ?? null,
        dto.state ?? null,
        dto.postalCode ?? null,
        dto.country ?? null,
        dto.latitude ?? null,
        dto.longitude ?? null,
        dto.isDefault ?? null,
        dto.status ?? null,
      ]
    );
    return result;
  }
}
