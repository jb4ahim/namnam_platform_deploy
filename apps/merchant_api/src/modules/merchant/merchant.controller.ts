import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@app/auth';

@Controller('merchant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}
  
  @Get('merchant-info')
  @UseGuards(AuthGuard)
  async getMerchantInfo(@Req() req: any) {
    const merchantId = req.user.userId.userId;
    const merchantInfo = await this.merchantService.getMerchantInfo(merchantId);
    if (!merchantInfo) {
      throw new NotFoundException('Merchant not found');
    }
    return merchantInfo;
  }

  @Get('schedule')
  @UseGuards(AuthGuard)
  async getWeeklySchedule(@Req() req: any) {
   const merchantId = req.user.userId.userId;
    const schedule = await this.merchantService.getWeeklySchedule(merchantId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  @Post('merchant-info')
  @UseGuards(AuthGuard)
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto, @Req() req: any) {
    const merchantId = req.user.userId.userId;
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto, merchantId);
  }

  @Get('contact-person')
  @UseGuards(AuthGuard)
  async getContactPersons(@Req() req: any) {
    const merchantId = req.user.userId.userId;
    const contactPersons = await this.merchantService.getContactPersons(merchantId);
    return contactPersons;
  }

  @Post('contact-person')
  @UseGuards(AuthGuard)
  async createContactPerson(@Body() createContactPersonDto: CreateContactPersonDto, @Req() req: any) {
    const merchantId = req.user.userId.userId;
    return await this.merchantService.createContactPerson(createContactPersonDto, merchantId);
  }

  @Post('schedule')
  @UseGuards(AuthGuard)
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto, @Req() req: any) {
    console.log('Creating weekly schedule:', createWeeklyScheduleDto);
    console.log('For request:', req);
    const merchantId = req.user.userId.userId;
    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto, merchantId);
  }
}