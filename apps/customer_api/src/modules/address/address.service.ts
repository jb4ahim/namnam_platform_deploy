import { Injectable } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressRepository } from './address.repository';

@Injectable()
export class AddressService {
  constructor(private readonly repo: AddressRepository) {}

  async list(customerId: number) {
    return this.repo.list(customerId);
  }

  async getById(addressId: number) {
    return this.repo.getById(addressId);
  }

  async create(userId: number, dto: CreateAddressDto) {
    return this.repo.create(userId, dto);
  }

  async update(userId: number, addressId: number, dto: UpdateAddressDto) {
    return this.repo.update(userId, addressId, dto);
  }

  async delete(userId: number, addressId: number) {
    return this.repo.delete(userId, addressId);
  }

  async getAllowedZones() {
    return this.repo.getAllowedZones();
  }

  async setDefault(userId: number, addressId: number) {
    return this.repo.update(userId, addressId, { isDefault: true });
  }
}
