import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { PaginatedResultDto, PaginationQueryDto } from '@app/common';

export type ManagementCustomer = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  email?: string | null;
  status?: string | null;
  created_at?: string | Date;
};

export type ManagementMerchant = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  status?: string | null;
  created_at?: string | Date;
};

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCustomers(pagination: PaginationQueryDto, search?: string): Promise<PaginatedResultDto<ManagementCustomer>> {
    const { items, totalCount } = await this.usersRepository.getCustomers(pagination, search);
    return PaginatedResultDto.create(items, totalCount, pagination);
  }

  async getMerchants(pagination: PaginationQueryDto, search?: string): Promise<PaginatedResultDto<ManagementMerchant>> {
    const { items, totalCount } = await this.usersRepository.getMerchants(pagination, search);
    return PaginatedResultDto.create(items, totalCount, pagination);
  }
}


