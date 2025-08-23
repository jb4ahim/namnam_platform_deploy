import { Injectable } from '@nestjs/common';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { DatabaseUtils, PostgresService } from '@app/database';

@Injectable()
export class MerchantRepository {
  constructor(private readonly pg: PostgresService) {}


  async createMerchantInfo(merchantInfoDto: CreateMerchantInfoDto, token: any) {
    console.log('Creating merchant info for userId:', token.userId);
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
        merchantInfoDto.location?.addressText,
        merchantInfoDto.location?.latitude,
        merchantInfoDto.location?.longitude,
        merchantInfoDto.coverKey,
        merchantInfoDto.imageKey,
        JSON.stringify(merchantInfoDto.imageKeys),
        merchantInfoDto.categoryId
      ]
    );
    console.log('createMerchantInfo result:', result);
    return result;
  }
  async getMerchant(email: string, countryCode: string, phoneNumber: string) {
   return await DatabaseUtils.callFunction(
     this.pg,
     'select_merchant',
     [email, countryCode, phoneNumber]
   );
  }

  async createWeeklySchedule(scheduleDto: CreateWeeklyScheduleDto, token: any) {
    console.log('Creating weekly schedule for merchantId:', token.userId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_weekly_schedule',
      [
        null,
        null, 
        token.userId,
        JSON.stringify(scheduleDto.weeklySchedule)
      ]
    );

    return result;
  }

  async getMerchantInfo(token: any) {
    const merchantId = token.userId;
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_info',
      [merchantId]
    );
    return result;
  }

  async getWeeklySchedule(token: any) {
    const merchantId = token.userId;
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_schedule_info_by_merchant_id',
      [merchantId]
    );
    return result;
  }
}