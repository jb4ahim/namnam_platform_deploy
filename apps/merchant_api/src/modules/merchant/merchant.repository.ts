import { Injectable } from '@nestjs/common';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class MerchantRepository {
  constructor(private readonly pg: PostgresService) {}


  async createMerchantInfo(merchantInfoDto: CreateMerchantInfoDto) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'create_restaurant_merchant',
      [
        null,
        null,
        null,
        merchantInfoDto.name,
        merchantInfoDto.description,
        null,
        merchantInfoDto.addressText,
        merchantInfoDto.location?.latitude,
        merchantInfoDto.location?.longitude,
        merchantInfoDto.coverKey,
        merchantInfoDto.imageKey,
        merchantInfoDto.imageKeys
      ]
    );
    return result;
  }
  async getMerchant(email: string, countryCode: string, phoneNumber: string) {
   return await DatabaseUtils.callFunction(
     this.pg,
     'select_merchant',
     [email, countryCode, phoneNumber]
   );
  }

  async createWeeklySchedule(scheduleDto: CreateWeeklyScheduleDto) {

    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'create_weekly_schedule',
      [
        scheduleDto.merchant_id,
        JSON.stringify(scheduleDto.weeklySchedule)
      ]
    );

    return result;
  }

  async getMerchantInfo(merchantId: number) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'get_merchant_info',
      [merchantId]
    );
    return result;
  }

  async getWeeklySchedule(merchantId: number) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'get_weekly_schedule',
      [merchantId]
    );
    return result;
  }
}