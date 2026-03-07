import { Controller, Get, Post, Body, NotFoundException, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import {
  MerchantInfoResponseDto,
  ScheduleItemDto,
  ContactPersonResponseDto,
  LocationResponseDto,
} from './dto/merchant-response.dto';
import { MerchantService } from './merchant.service';
import { AuthGuard } from '@app/auth';
import { CurrentMerchantId } from '@app/common/decorators';

@ApiTags('Merchants')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('merchants')
export class MerchantController {
  constructor(private readonly merchantService: MerchantService) {}

  @Get('info')
  @ApiOperation({ summary: 'Get merchant info' })
  @ApiResponse({ status: 200, type: MerchantInfoResponseDto, description: 'Merchant info with onboarding steps' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMerchantInfo(@CurrentMerchantId() merchantId: number) {
    console.log('Fetching merchant info for merchantId:', merchantId);
    const merchantInfo = await this.merchantService.getMerchantInfo(merchantId);
    return merchantInfo;
  }

  @Get('schedules')
  @ApiOperation({ summary: 'Get weekly schedule' })
  @ApiResponse({ status: 200, type: [ScheduleItemDto], description: 'Weekly schedule with open/close times per day' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Schedule not found' })
  async getWeeklySchedule(@CurrentMerchantId() merchantId: number) {
    const schedule = await this.merchantService.getWeeklySchedule(merchantId);
    if (!schedule) {
      throw new NotFoundException('Schedule not found');
    }
    return schedule;
  }

  @Post('info')
  @ApiOperation({ summary: 'Create or update merchant info' })
  @ApiResponse({ status: 201, description: 'Merchant info created or updated' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createMerchantInfo(@Body() createMerchantInfoDto: CreateMerchantInfoDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createMerchantInfo(createMerchantInfoDto, merchantId);
  }

  @Get('contact-person')
  @ApiOperation({ summary: 'Get contact person' })
  @ApiResponse({ status: 200, type: ContactPersonResponseDto, description: 'Merchant contact person details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getContactPersons(@CurrentMerchantId() merchantId: number) {
    const contactPersons = await this.merchantService.getContactPersons(merchantId);
    return contactPersons;
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get categories' })
  @ApiQuery({ name: 'parentId', required: false, type: Number, description: 'Parent category ID to filter subcategories' })
  @ApiResponse({ status: 200, type: [GetCategoryDto], description: 'List of categories' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCategories(@Query('parentId') parentId: number) {
    const categories = await this.merchantService.getCategories(parentId);
    return categories;
  }

  @Post('contact-person')
  @ApiOperation({ summary: 'Create contact person' })
  @ApiResponse({ status: 201, type: ContactPersonResponseDto, description: 'Contact person created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createContactPerson(@Body() createContactPersonDto: CreateContactPersonDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createContactPerson(createContactPersonDto, merchantId);
  }

  @Post('schedules')
  @ApiOperation({ summary: 'Create weekly schedule' })
  @ApiResponse({ status: 201, description: 'Weekly schedule created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createWeeklySchedule(@Body() createWeeklyScheduleDto: CreateWeeklyScheduleDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createWeeklySchedule(createWeeklyScheduleDto, merchantId);
  }

  @Post('location')
  @ApiOperation({ summary: 'Create merchant location' })
  @ApiResponse({ status: 201, description: 'Location created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createLocation(@Body() createLocationDto: CreateLocationDto, @CurrentMerchantId() merchantId: number) {
    return await this.merchantService.createLocation(createLocationDto, merchantId);
  }

  @Get('location')
  @ApiOperation({ summary: 'Get merchant location' })
  @ApiResponse({ status: 200, type: LocationResponseDto, description: 'Merchant location details' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getLocation(@CurrentMerchantId() merchantId: number) {
    return await this.merchantService.getLocation(merchantId);
  }

  @Post('request-approval')
  @ApiOperation({ summary: 'Request merchant approval' })
  @ApiResponse({ status: 201, description: 'Approval request submitted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async requestApproval(@CurrentMerchantId() merchantId: number) {
    return await this.merchantService.requestApproval(merchantId);
  }
}
