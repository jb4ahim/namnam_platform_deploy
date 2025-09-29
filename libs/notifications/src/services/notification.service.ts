import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
import { INotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationResponseDto, NotificationType, SendNotificationDto, BulkNotificationDto, NotificationTemplate } from '../dto/notification.dto';
import { EmailProvider } from '../providers/email.provider';
import { FirebaseProvider } from '../providers/firebase.provider';
import { TemplateService } from './template.service';
// import { NotificationLog } from '../entities/notification-log.entity';

@Injectable()
export class NotificationService {
  private providers: Map<NotificationType, INotificationProvider>;

  constructor(
    private emailProvider: EmailProvider,
    private firebaseProvider: FirebaseProvider,
    private templateService: TemplateService,
    // Comment out repository injection for now
    // @InjectRepository(NotificationLog)
    // private notificationLogRepo: Repository<NotificationLog>,
  ) {
    console.log('NotificationService: Initializing service...');
    this.providers = new Map([
      [NotificationType.EMAIL, this.emailProvider],
      [NotificationType.FIREBASE, this.firebaseProvider],
    ]);
    console.log('NotificationService: Providers registered:', Array.from(this.providers.keys()));
  }

  async send(notification: SendNotificationDto): Promise<NotificationResponseDto> {
    console.log('NotificationService: Attempting to send notification:', {
      type: notification.type,
      recipient: notification.recipient,
      subject: notification.subject,
      template: notification.template
    });

    try {
      // TODO: Add logging back when database is configured
      // const log = this.notificationLogRepo.create({...});

      let processedNotification = { ...notification };

      // Apply template if specified
      if (notification.template && notification.template !== NotificationTemplate.CUSTOM) {
        console.log('NotificationService: Applying template:', notification.template);
        const rendered = this.templateService.renderTemplate(
          notification.template,
          notification.templateData || {}
        );
        processedNotification.subject = rendered.subject;
        processedNotification.message = rendered.text;
        processedNotification.data = {
          ...processedNotification.data,
          html: rendered.html,
        };
        console.log('NotificationService: Template applied, new subject:', rendered.subject);
      }

      const provider = this.providers.get(notification.type);
      if (!provider) {
        console.error('NotificationService: Provider not found for type:', notification.type);
        throw new Error(`Unsupported notification type: ${notification.type}`);
      }

      console.log('NotificationService: Sending notification via provider:', notification.type);
      const result = await provider.send(processedNotification);
      console.log('NotificationService: Provider response:', result);

      // TODO: Update log when database is configured
      return result;
    } catch (error) {
      console.error('NotificationService: Error sending notification:', error.message);
      // TODO: Log error when database is configured
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendBulk(bulkNotification: BulkNotificationDto): Promise<NotificationResponseDto[]> {
    console.log('NotificationService: Sending bulk notification to', bulkNotification.recipients.length, 'recipients');
    
    const results = await Promise.allSettled(
      bulkNotification.recipients.map((recipient, index) => {
        console.log(`NotificationService: Processing bulk notification ${index + 1}/${bulkNotification.recipients.length} for:`, recipient);
        return this.send({
          type: bulkNotification.type,
          recipient,
          subject: bulkNotification.subject,
          message: bulkNotification.message,
          template: bulkNotification.template,
          data: bulkNotification.data,
        });
      })
    );

    const responses = results.map(result => 
      result.status === 'fulfilled' 
        ? result.value 
        : { success: false, error: result.reason }
    );

    console.log('NotificationService: Bulk notification completed. Success rate:', 
      responses.filter(r => r.success).length + '/' + responses.length);

    return responses;
  }

  // Method to add new providers in the future
  addProvider(type: NotificationType, provider: INotificationProvider) {
    console.log('NotificationService: Adding new provider:', type);
    this.providers.set(type, provider);
  }
}