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

  async create(dto: CreateAddressDto) {
    return this.repo.create(dto);
  }

  async update(addressId: number, dto: UpdateAddressDto) {
    return this.repo.update(addressId, dto);
  }
}
