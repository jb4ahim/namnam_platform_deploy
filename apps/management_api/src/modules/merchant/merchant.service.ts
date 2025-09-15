import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MerchantRepository } from './merchant.repository';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';

@Injectable()
export class MerchantService {
  constructor(private readonly merchantRepository: MerchantRepository) {}



  async getMerchantById(merchantId: number) {
    try {
      const merchant = await this.merchantRepository.getMerchantById(merchantId);
      if (!merchant) {
        throw new NotFoundException(`Merchant with ID ${merchantId} not found`);
      }
      return merchant;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Error getting merchant by ID:', error);
      throw new BadRequestException('Failed to fetch merchant');
    }
  }

  async getMerchants(searchTerm: string, limit?: number, offset?: number) {
      return await this.merchantRepository.getMerchants({ page: offset, pageSize: limit }, searchTerm);
  }




  async deleteMerchant(merchantId: number) {
    try {
      const result = await this.merchantRepository.deleteMerchant(merchantId);
      if (!result) {
        throw new BadRequestException('Failed to delete merchant');
      }
      return {
        success: true,
        message: 'Merchant deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting merchant:', error);
      throw new BadRequestException('Failed to delete merchant');
    }
  }

  async approveMerchant(merchantId: number) {
    try {
      const result = await this.merchantRepository.approveMerchant(merchantId);
      if (!result) {
        throw new BadRequestException('Failed to approve merchant');
      }
      return {
        success: true,
        message: 'Merchant approved successfully',
        data: result
      };
    } catch (error) {
      console.error('Error approving merchant:', error);
      throw new BadRequestException('Failed to approve merchant');
    }
  }

  async suspendMerchant(merchantId: number, reason?: string) {
    try {
      const result = await this.merchantRepository.suspendMerchant(merchantId, reason);
      if (!result) {
        throw new BadRequestException('Failed to suspend merchant');
      }
      return {
        success: true,
        message: 'Merchant suspended successfully',
        data: result
      };
    } catch (error) {
      console.error('Error suspending merchant:', error);
      throw new BadRequestException('Failed to suspend merchant');
    }
  }

  // Additional GET methods from merchant API
  async getMerchantDetailedInfo(merchantId: number) {
    try {
      return await this.merchantRepository.getMerchantDetailedInfo(merchantId);
    } catch (error) {
      console.error('Error getting merchant detailed info:', error);
      throw new BadRequestException('Failed to get merchant detailed info');
    }
  }

  async getWeeklySchedule(merchantId: number) {
    try {
      return await this.merchantRepository.getWeeklySchedule(merchantId);
    } catch (error) {
      console.error('Error getting weekly schedule:', error);
      throw new BadRequestException('Failed to get weekly schedule');
    }
  }

  async getContactPersons(merchantId: number) {
    try {
      return await this.merchantRepository.getContactPersons(merchantId);
    } catch (error) {
      console.error('Error getting contact persons:', error);
      throw new BadRequestException('Failed to get contact persons');
    }
  }

  async getLocation(merchantId: number) {
    try {
      return await this.merchantRepository.getLocation(merchantId);
    } catch (error) {
      console.error('Error getting location:', error);
      throw new BadRequestException('Failed to get location');
    }
  }

  async getCategories(parentId?: number) {
    try {
      return await this.merchantRepository.getCategories(parentId);
    } catch (error) {
      console.error('Error getting categories:', error);
      throw new BadRequestException('Failed to get categories');
    }
  }
}