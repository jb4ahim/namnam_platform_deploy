import { Injectable } from '@nestjs/common';
import * as admin from "firebase-admin";

@Injectable()
export class NotificationsService {
    async sendNotification(to: string, message: string) {
        // Placeholder for sending notification logic
        console.log(`Sending notification to ${to}: ${message}`);
        return { success: true };
    }

}
