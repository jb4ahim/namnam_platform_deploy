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
      'insert_merchant_info',
      [
        merchantInfoDto.name,
        merchantInfoDto.description,
        merchantInfoDto.hotline,
        merchantInfoDto.appSectionId,
        merchantInfoDto.cuisineTypeIds || null,
        merchantInfoDto.shopTypeIds || null
      ]
    );
    return result;
  }

  async createWeeklySchedule(scheduleDto: CreateWeeklyScheduleDto) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_weekly_schedule',
      [
        scheduleDto.merchant_id,
        JSON.stringify(scheduleDto.weeklySchedule)
      ]
    );
    return result;
  }


}