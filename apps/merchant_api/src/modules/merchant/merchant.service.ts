import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { CreateContactPersonDto } from './dto/create-contact-person.dto';
import { CreateMerchantInfoDto } from './dto/create-merchant-info.dto';
import { CreateWeeklyScheduleDto } from './dto/create-weekly-schedule.dto';
import { MerchantRepository } from './merchant.repository';
import { CreateLocationDto } from './dto/create-location.dto';
import { GetCategoryDto } from './dto/get-category.dto';
import { plainToInstance } from 'class-transformer';
import { S3PresignService } from '@app/storage/s3-presign.service';

@Injectable()
export class MerchantService {

  constructor(
    private readonly merchantRepository: MerchantRepository,
    private readonly s3Service: S3PresignService,
  ) {}
  async getMerchantInfo(merchantId: number) {
    return await this.merchantRepository.getMerchantInfo(merchantId);
  }

  async getWeeklySchedule(merchantId: number) {
    return await this.merchantRepository.getWeeklySchedule(merchantId);
  }

  async getContactPersons(merchantId: number) {
    return await this.merchantRepository.getContactPersons(merchantId);
  }
  async getCategories(parentId: number) {
   const categories = await this.merchantRepository.getCategories(parentId);
           const dtos = await Promise.all(categories.map(async category => {
             const imageUrl = category.imageKey
               ? await this.s3Service.getPresignedDownloadUrl(category.imageKey)
               : null;
             return plainToInstance(GetCategoryDto, {
               ...category,
               imageUrl,
             });
           }));
       return dtos;
  }

  async createContactPerson(createContactPersonDto: CreateContactPersonDto, merchantId: number) {
    try {
      const result = await this.merchantRepository.createContactPerson(createContactPersonDto, merchantId);
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

  async getMerchant(countryCode: string, phoneNumber: string) {
    return await this.merchantRepository.getMerchant(countryCode, phoneNumber);
  }

  async createMerchantInfo(createMerchantInfoDto: CreateMerchantInfoDto, merchantId: number) {
    try {

      const result = await this.merchantRepository.createMerchantInfo(createMerchantInfoDto, merchantId);
      if (!result) {
        throw new BadRequestException('Failed to create merchant info');
      }
      return {
        message: 'Merchant info created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating merchant info:', error);
      throw new BadRequestException('Failed to create merchant info');
    }
  }

  async createWeeklySchedule(createWeeklyScheduleDto: CreateWeeklyScheduleDto, merchantId: number) {
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
        if (daySchedule.isOpen && (!daySchedule.open || !daySchedule.close)) {
          throw new BadRequestException(`Open and close times are required for ${daySchedule.day} when is_open is true`);
        }
      }

      const result = await this.merchantRepository.createWeeklySchedule(createWeeklyScheduleDto, merchantId);
      if (!result) {
        throw new BadRequestException('Failed to create weekly schedule');
      }
      return {
        message: 'Weekly schedule created successfully',
        data: result
      };
    } catch (error) {
      console.error('Error creating weekly schedule:', error);
      throw new BadRequestException('Failed to create weekly schedule');
    }
  }

  async createLocation(createLocationDto: CreateLocationDto, merchantId: number) {
    try {
      const result = await this.merchantRepository.createLocation(createLocationDto, merchantId);

      return {
        message: 'Location created successfully',
      };
    } catch (error) {
      console.error('Error creating location:', error);
      throw new BadRequestException('Failed to create location');
    }
  }
  async getLocation(merchantId: number) {
    return await this.merchantRepository.getLocation(merchantId);
  } 
}