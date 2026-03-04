import { Controller, Get, Post, Body, Param, NotFoundException, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@app/auth';
import { CurrentMerchantId, CurrentUserId } from '@app/common/decorators';

@ApiTags('Merchants')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('info')
  @ApiOperation({ summary: 'Get merchant info' })
  async getMerchantInfo(@CurrentMerchantId() merchantId: number) {
    console.log('Fetching merchant info for merchantId:', merchantId);
    const merchantInfo = await this.merchantService.getMerchantInfo(merchantId);
    return merchantInfo;
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get weekly schedule' })
  async getWeeklySchedule(@CurrentMerchantId() merchantId: number) {
    const schedule = await this.merchantService.getWeeklySchedule(merchantId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  @Post('info')
  @ApiOperation({ summary: 'Create or update merchant info' })
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto,@CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto, merchantId);
  }

  @Get('contact-person')
  @ApiOperation({ summary: 'Get contact persons' })
  async getContactPersons(@CurrentMerchantId() merchantId: number) {
    const contactPersons = await this.merchantService.getContactPersons(merchantId);
    return contactPersons;
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get categories' })
  @ApiQuery({ name: 'parentId', required: false, type: Number, description: 'Parent category ID' })
  async getCategories(@Query('parentId') parentId: number) {
    const categories = await this.merchantService.getCategories(parentId);
    return categories;
  }

  @Post('contact-person')
  @ApiOperation({ summary: 'Create contact person' })
  async createContactPerson(@Body() createContactPersonDto: CreateContactPersonDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createContactPerson(createContactPersonDto, merchantId);
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create weekly schedule' })
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto, @CurrentMerchantId() merchantId: number) {

    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto, merchantId);
  }

  @Post('location')
  @ApiOperation({ summary: 'Create merchant location' })
  async createLocation(@Body() createLocationDto: CreateLocationDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createLocation(createLocationDto, merchantId);
  }

  @Get('location')
  @ApiOperation({ summary: 'Get merchant location' })
  async getLocation(@CurrentMerchantId() merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }
  @Post('request-approval')
  @ApiOperation({ summary: 'Request merchant approval' })
  async requestApproval(@CurrentMerchantId() merchantId: number) {
    return await this.merchantService.requestApproval(merchantId);
  }
}