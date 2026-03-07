import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { PaginatedResultDto, PaginationQueryDto } from '@app/common/dto';
import { GetMerchantDto } from './dto/get-merchants.dto';

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
  async getMerchantTokenByUserId(merchantId: number) {
      const result = await DatabaseUtils.callFunction(
        this.pg,
        'select_merchant_fcm_token_by_user_id',
        [merchantId],
        false
      );
      return result || null;
  }

  async getMerchants(
    pagination: PaginationQueryDto,
    search?: string
  ): Promise<PaginatedResultDto<GetMerchantDto>> {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const sortBy = pagination.sortBy || 'created_at';
    const sortOrder = pagination.sortOrder || 'DESC';

    const result = await DatabaseUtils.callFunction<PaginatedResultDto<GetMerchantDto>>(
      this.pg,
      'select_management_merchants',
      [page, pageSize, sortBy, sortOrder, search || null],
      false
    );

    const single = Array.isArray(result) ? result[0] : result;

    if (!single || typeof single !== 'object') {
      return {
        items: [],
        totalCount: 0,
        totalPages: 0,
        pageSize: pageSize,
        page: page,
        hasPreviousPage: false,
        hasNextPage: false
      };
    }

    return single as PaginatedResultDto<GetMerchantDto>;
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
      'select_merchant_info_management',
      [merchantId],
      false
    );
    return result;
  }

  async getWeeklySchedule(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_schedule_info_by_merchant_id_management',
      [merchantId],
      false
    );
    return result;
  }

  async getContactPersons(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_restaurant_contact_person_management',
      [merchantId],
      true
    );
    return result || [];
  }

  async getLocation(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_location_info_by_merchant_id_management',
      [merchantId],
      false
    );
    return result;
  }

  async getCatalog(merchantId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_catalog_management',
      [merchantId],
      true
    );
    return result || [];
  }
  async getCatalogProductsBySection(merchantId?: number, sectionId?: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_catalog_management',
      [merchantId, sectionId],
      true
    );
    return result || [];
  }
  async getMerchantRequests(status: string = 'pending') {
    const query = `SELECT select_merchant_requests_management($1::merchant_request_status)`;
    const rows = await this.pg.query(query, [status]);
    const result = DatabaseUtils.extractSingleResult(rows, 'select_merchant_requests_management');
    return result || [];
  }
  async updateMerchantStatus(merchantId: number, status: string, zoneId: number) {
    console.log('Updating merchant status:', merchantId, 'status:', status, 'zoneId:', zoneId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'update_merchant_request_status',
      [merchantId, status, null, null, null, null]
    );
    console.log('updateMerchantStatus result:', result);
    return result;
  }
}