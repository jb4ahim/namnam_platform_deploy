import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req, Query } from '@nestjs/common';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@app/auth';
import { CurrentUserId } from '@app/common/decorators';

@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}
  
  @Get('info')
  @UseGuards(AuthGuard)
  async getMerchantInfo(@CurrentUserId() merchantId: number) {
    const merchantInfo = await this.merchantService.getMerchantInfo(merchantId);
    if (!merchantInfo) {
      throw new NotFoundException('Merchant not found');
    }
    return merchantInfo;
  }

  @Get('schedules')
  @UseGuards(AuthGuard)
  async getWeeklySchedule(@CurrentUserId() merchantId: number) {
    const schedule = await this.merchantService.getWeeklySchedule(merchantId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  @Post('info')
  @UseGuards(AuthGuard)
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto,@CurrentUserId() merchantId: number) {
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto, merchantId);
  }

  @Get('contact-person')
  @UseGuards(AuthGuard)
  async getContactPersons(@CurrentUserId() merchantId: number) {
    const contactPersons = await this.merchantService.getContactPersons(merchantId);
    return contactPersons;
  }

  @Get('categories')
  @UseGuards(AuthGuard)
  async getCategories(@Query('parentId') parentId: number) {
    const categories = await this.merchantService.getCategories(parentId);
    return categories;
  }

  @Post('contact-person')
  @UseGuards(AuthGuard)
  async createContactPerson(@Body() createContactPersonDto: CreateContactPersonDto, @CurrentUserId() merchantId: number) {
    return await this.merchantService.createContactPerson(createContactPersonDto, merchantId);
  }

  @Post('schedules')
  @UseGuards(AuthGuard)
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto, @CurrentUserId() merchantId: number) {
    console.log('Creating weekly schedule:', createWeeklyScheduleDto);
    console.log('For merchantId:', merchantId);
    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto, merchantId);
  }

  @Post('location')
  @UseGuards(AuthGuard)
  async createLocation(@Body() createLocationDto: CreateLocationDto, @CurrentUserId() merchantId: number) {
    return await this.merchantService.createLocation(createLocationDto, merchantId);
  }

  @Get('location')
  @UseGuards(AuthGuard)
  async getLocation(@CurrentUserId() merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }
}