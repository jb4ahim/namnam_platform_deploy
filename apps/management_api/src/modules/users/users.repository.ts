import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { PaginationQueryDto } from '@app/common';

type CustomersListRow = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  phone_number?: string | null;
  email?: string | null;
  status?: string | null;
  created_at?: string | Date;
};

type MerchantsListRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  status?: string | null;
  created_at?: string | Date;
};

@Injectable()
export class UsersRepository {
  constructor(private readonly pg: PostgresService) {}

  async getCustomers(pagination: PaginationQueryDto, search?: string): Promise<{ items: CustomersListRow[]; totalCount: number }> {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const sortBy = pagination.sortBy || 'created_at';
    const sortOrder = pagination.sortOrder || 'DESC';

    const result = await DatabaseUtils.callFunction<{ items: CustomersListRow[]; total_count: number }>(
      this.pg,
      'select_management_customers_json',
      [page, pageSize, sortBy, sortOrder, search || null],
      false
    );

    const single = Array.isArray(result) ? result[0] : result;

    if (!single) {
      return { items: [], totalCount: 0 };
    }

    return { items: single.items || [], totalCount: (single.total_count as unknown as number) || 0 };
  }

  async getMerchants(pagination: PaginationQueryDto, search?: string): Promise<{ items: MerchantsListRow[]; totalCount: number }> {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const sortBy = pagination.sortBy || 'created_at';
    const sortOrder = pagination.sortOrder || 'DESC';

    const result = await DatabaseUtils.callFunction<{ items: MerchantsListRow[]; total_count: number }>(
      this.pg,
      'select_management_merchants_json',
      [page, pageSize, sortBy, sortOrder, search || null],
      false
    );

    const single = Array.isArray(result) ? result[0] : result;

    if (!single) {
      return { items: [], totalCount: 0 };
    }

    return { items: single.items || [], totalCount: (single.total_count as unknown as number) || 0 };
  }
}


