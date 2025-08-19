import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@app/auth';

@Controller('merhcant')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}
  
  @Get('merchant-info')
  @UseGuards(AuthGuard)
  async getMerchantInfo(@Req() req: any) {
    const merchantId = req.user.userId;
    const merchantInfo = await this.merchantService.getMerchantInfo(merchantId);
    if (!merchantInfo) {
      throw new NotFoundException('Merchant not found');
    }
    return merchantInfo;
  }

  @Get('schedule')
  @UseGuards(AuthGuard)
  async getWeeklySchedule(@Req() req: any) {
    const merchantId = req.user.userId; 
    const schedule = await this.merchantService.getWeeklySchedule(merchantId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  @Post('merchant-info')
  @UseGuards(AuthGuard)
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto) {
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto);
  }

  @Post('schedule')
  @UseGuards(AuthGuard)
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto, @Req() req: any) {
    const userId = req.user.userId; 
    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto, userId);
  }
}