import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { MerchantRepository } from './merchant.repository';

@Injectable()
export class MerchantService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly merchantRepository: MerchantRepository
  ) {}

  // New methods for merchant APIs
  async createContactPerson(createContactPersonDto: CreateContactPersonDto) {
    try {
      const result = await this.merchantRepository.createContactPerson(createContactPersonDto);
      if (!result) {
        throw new BadRequestException('Failed to create contact person');
      }
      return {
        success: true,
        message: 'Contact person created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating contact person:', error);
      throw new BadRequestException('Failed to create contact person');
    }
  }

  async createMerchantInfo(createMerchantInfoDto: CreateMerchantInfoDto) {
    try {
      // Validate that either cuisine_type_ids or shop_type_ids is provided
      if (!createMerchantInfoDto.cuisine_type_ids && !createMerchantInfoDto.shop_type_ids) {
        throw new BadRequestException('Either cuisine_type_ids or shop_type_ids must be provided');
      }

      const result = await this.merchantRepository.createMerchantInfo(createMerchantInfoDto);
      if (!result) {
        throw new BadRequestException('Failed to create merchant info');
      }
      return {
        success: true,
        message: 'Merchant info created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating merchant info:', error);
      throw new BadRequestException('Failed to create merchant info');
    }
  }

  async createWeeklySchedule(createWeeklyScheduleDto: CreateWeeklyScheduleDto) {
    try {
      // Validate that all days of the week are provided
      const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      const providedDays = createWeeklyScheduleDto.weeklySchedule.map(day => day.day.toLowerCase());
      
      // Optional: Check if all days are provided (uncomment if required)
      // const missingDays = validDays.filter(day => !providedDays.includes(day));
      // if (missingDays.length > 0) {
      //   throw new BadRequestException(`Missing schedule for days: ${missingDays.join(', ')}`);
      // }

      // Validate that open days have both open and close times
      for (const daySchedule of createWeeklyScheduleDto.weeklySchedule) {
        if (daySchedule.is_open && (!daySchedule.open || !daySchedule.close)) {
          throw new BadRequestException(`Open and close times are required for ${daySchedule.day} when is_open is true`);
        }
      }

      const result = await this.merchantRepository.createWeeklySchedule(createWeeklyScheduleDto);
      if (!result) {
        throw new BadRequestException('Failed to create weekly schedule');
      }
      return {
        success: true,
        message: 'Weekly schedule created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating weekly schedule:', error);
      throw new BadRequestException('Failed to create weekly schedule');
    }
  }
}