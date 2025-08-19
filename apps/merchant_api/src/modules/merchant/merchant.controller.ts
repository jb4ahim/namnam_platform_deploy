import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { MerchantService } from './merchant.service';

@Controller('merhcant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}


  @Post('merchant-info')
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto) {
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto);
  }

  @Post('schedule')
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto) {
    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto);
  }
}