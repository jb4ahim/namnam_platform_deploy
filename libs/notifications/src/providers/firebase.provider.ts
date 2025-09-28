import { Injectable } from '@nestjs/common';
import { INotificationProvider } from '../interfaces/notification-provider.interface';
import { NotificationResponseDto, SendNotificationDto } from '../dto/notification.dto';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseProvider implements INotificationProvider {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
      });
    }
  }

  async send(notification: SendNotificationDto): Promise<NotificationResponseDto> {
    try {
      const message = {
        notification: {
          title: notification.subject,
          body: notification.message,
        },
        data: notification.data || {},
        token: notification.recipient, // Firebase token
      };

      const response = await admin.messaging().send(message);

      return {
        success: true,
        messageId: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
