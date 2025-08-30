import { Injectable } from '@nestjs/common';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { DatabaseUtils, PostgresService } from '@app/database';
import { CreateLocationDto } from './dto/create-location.dto';

@Injectable()
export class MerchantRepository {
  constructor(private readonly pg: PostgresService) {}

  async getContactPersons(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_restaurant_contact_person',
      [merchantId],
      false
    );
    return result || [];
  }

  async getCategories(parentId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_categories',
      [parentId],
      false
    );
    return result || [];
  }

  async createContactPerson(contactPersonDto: CreateContactPersonDto, merchantId: number) {
    console.log('Creating contact person for merchantId:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'create_merchant_contact_person',
      [
        merchantId,
        contactPersonDto.firstName,
        contactPersonDto.lastName,
        contactPersonDto.role,
        contactPersonDto.emailAddress,
        contactPersonDto.phoneNumber
      ]
    );
    console.log('createContactPerson result:', result);
    return result;
  }

  async createMerchantInfo(merchantInfoDto: CreateMerchantInfoDto, merchantId: number) {
    console.log('Creating merchant info for userId:', merchantId);
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
        merchantInfoDto.coverKey,
        merchantInfoDto.imageKey,
        null,
        merchantInfoDto.categoryId,
        merchantId
      ]
    );
    console.log('createMerchantInfo result:', result);
    return result;
  }
  async getMerchant( countryCode: string, phoneNumber: string) {
   return await DatabaseUtils.callFunction(
     this.pg,
     'select_merchant',
     [countryCode, phoneNumber]
   );
  }

  async createWeeklySchedule(scheduleDto: CreateWeeklyScheduleDto, merchantId: number) {
    console.log('Creating weekly schedule for merchantId:', merchantId);
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'insert_weekly_schedule',
      [
        null,
        null, 
        merchantId,
        JSON.stringify(scheduleDto.weeklySchedule)
      ]
    );

    return result;
  }

  async getMerchantInfo(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_merchant_info',
      [merchantId]
    );
    return result;
  }

  async getWeeklySchedule(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_schedule_info_by_merchant_id',
      [merchantId]
    );
    return result;
  }
  
  async createLocation(createLocationDto: CreateLocationDto, merchantId: number) {
    const result = await DatabaseUtils.callProcedure(
      this.pg,
      'create_location_merchant',
      [
        merchantId,
        createLocationDto.latitude,
        createLocationDto.longitude,
        createLocationDto.street,
        createLocationDto.building,
        createLocationDto.notes,
        JSON.stringify(createLocationDto.buildingImages)
      ]
    );
    return result;
  }

  async getLocation(merchantId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_location_info_by_merchant_id',
      [merchantId]
    );
    return result;
  }
}