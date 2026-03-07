import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MerchantRepository } from './merchant.repository';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { resolveS3Urls, S3PresignService } from '@app/storage';
import { GetMerchantDto } from './dto/get-merchants.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResultDto } from '@app/common/dto/paginated-result.dto';
import { EmailProvider, NotificationService, NotificationTemplate, NotificationType, SendNotificationDto } from '@app/notifications';

@Injectable()
export class MerchantService {
  constructor(private readonly merchantRepository: MerchantRepository,
    private readonly s3Service: S3PresignService,
    private readonly notificationService: NotificationService
  ) {}



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

  async getMerchants(searchTerm?: string, limit?: number, offset?: number):Promise<PaginatedResultDto<GetMerchantDto>> {
        const merchants = await this.merchantRepository.getMerchants({ page: offset, pageSize: limit }, searchTerm);
        const dtos = await Promise.all(
          merchants.items.map(merchant =>
            resolveS3Urls(plainToInstance(GetMerchantDto, merchant), this.s3Service)
          )
        );
        return {
          items: dtos,
          totalCount: merchants.totalCount,
          page: merchants.page,
          pageSize: merchants.pageSize,
          hasNextPage: merchants.hasNextPage,
          hasPreviousPage: merchants.hasPreviousPage,
          totalPages: merchants.totalPages
        };
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

      // Send approval notification to merchant
      if (result.email) {
        const notificationEmail: SendNotificationDto = {
          recipient: result.email,
          subject: 'Merchant Account Approved',
          message: `Congratulations! Your merchant account has been approved and is now active.`,
          type: NotificationType.EMAIL,
        };
        await this.notificationService.send(notificationEmail);
      }

      // Send Firebase notification if FCM token is available
      const merchantToken = await this.merchantRepository.getMerchantTokenByUserId(merchantId);
      if (merchantToken?.fcmToken) {
        const notificationFirebase: SendNotificationDto = {
          recipient: merchantToken.fcmToken,
          subject: 'Merchant Account Approved',
          message: `Congratulations! Your merchant account has been approved and is now active.`,
          type: NotificationType.FIREBASE,
        };
        await this.notificationService.send(notificationFirebase);
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
      const result = await this.merchantRepository.getMerchantDetailedInfo(merchantId);
      if (result?.category?.categoryIcon) {
        result.category.categoryIcon = await this.s3Service.getPresignedDownloadUrl(result.category.categoryIcon);
      }
      return result;
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

  async getCatalog(merchantId?: number) {
      return await this.merchantRepository.getCatalog(merchantId);

  }

  async getCatalogProductsBySection(merchantId?: number, sectionId?: number) {
      return await this.merchantRepository.getCatalogProductsBySection(merchantId, sectionId);
  }

  async getMerchantRequests(status: string = 'pending') {
      return await this.merchantRepository.getMerchantRequests(status);
  }

  async updateMerchantStatus(merchantId: number, status: string, zoneId: number) {
      const result = await this.merchantRepository.updateMerchantStatus(merchantId, status, zoneId);
      const token = await this.merchantRepository.getMerchantTokenByUserId(merchantId);
      if(token) {
      const notificationFirebase: SendNotificationDto = {
        recipient: token.fcmToken,
        subject: 'Merchant Status Update',
        message: `Your merchant account status has been updated to: ${status}`,
        type: NotificationType.FIREBASE
      };
      await this.notificationService.send(notificationFirebase);
    }
      const notificationEmail: SendNotificationDto = {
        recipient: token.email,
        subject: 'Merchant Status Update',
        message: `Your merchant account status has been updated to: ${status}`,
        type: NotificationType.EMAIL,
        template: NotificationTemplate.WELCOME
      };
      
      await this.notificationService.send(notificationEmail);

      if (!result) {
        throw new BadRequestException('Failed to update merchant status');
      }

      return {
        success: true,
        message: 'Merchant status updated successfully',
        data: result
      };
    
}
}