import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginationQueryDto } from '@app/common/dto';
type MerchantsListRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  status?: string | null;
  created_at?: string | Date;
};
@Injectable()
export class MerchantRepository {
  constructor(private readonly pg: PostgresService) {}
  

  async getAllMerchants(limit?: number, offset?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'get_all_merchants',
      [limit || 50, offset || 0],
      true
    );
    return result || [];
  }

  async getMerchantById(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'get_merchant_by_id',
      [merchantId],
      false
    );
    return result || null;
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





  async deleteMerchant(merchantId: number) {
    console.log('Deleting merchant:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'delete_merchant',
      [merchantId]
    );
    console.log('deleteMerchant result:', result);
    return result;
  }

  async approveMerchant(merchantId: number) {
    console.log('Approving merchant:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'approve_merchant',
      [merchantId]
    );
    console.log('approveMerchant result:', result);
    return result;
  }

  async suspendMerchant(merchantId: number, reason?: string) {
    console.log('Suspending merchant:', merchantId, 'reason:', reason);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'suspend_merchant',
      [merchantId, reason || null]
    );
    console.log('suspendMerchant result:', result);
    return result;
  }

  // Additional GET methods from merchant API
  async getMerchantDetailedInfo(merchantId: number) {
    console.log('Retrieving merchant detailed info for merchantId:', merchantId);
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_info',
      [merchantId],
      false
    );
    return result;
  }

  async getWeeklySchedule(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_schedule_info_by_merchant_id',
      [merchantId],
      false
    );
    return result;
  }

  async getContactPersons(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_restaurant_contact_person',
      [merchantId],
      true
    );
    return result || [];
  }

  async getLocation(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_location_info_by_merchant_id',
      [merchantId],
      false
    );
    return result;
  }

  async getCategories(parentId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_categories',
      [parentId || null],
      true
    );
    return result || [];
  }
}