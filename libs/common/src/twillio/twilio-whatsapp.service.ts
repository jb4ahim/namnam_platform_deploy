// src/common/twilio/twilio-whatsapp.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class TwilioWhatsAppService {
  private twilioClient: twilio.Twilio;

  constructor(
    private readonly configService: ConfigService,
  ) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    
    if (!accountSid || !authToken) {
      throw new Error('Twilio credentials are not configured');
    }

    this.twilioClient = twilio(accountSid, authToken);
  }

  /**
   * Send OTP via WhatsApp
   * @param phoneNumber - Phone number in international format (e.g., +1234567890)
   * @param otp - The OTP code to send
   */
  async sendOTPViaWhatsApp(phoneNumber: string, otp: number): Promise<void> {
    try {
      const fromWhatsApp = this.configService.get<string>('TWILIO_WHATSAPP_FROM'); // e.g., 'whatsapp:+14155238886'
      const toWhatsApp = `whatsapp:${phoneNumber}`;

      const message = `Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`;

      const result = await this.twilioClient.messages.create({
        from: fromWhatsApp,
        to: toWhatsApp,
        body: message,
      });


    } catch (error) {

      throw new Error(`Failed to send WhatsApp OTP: ${error}`);
    }
  }

  /**
   * Send custom WhatsApp message
   * @param phoneNumber - Phone number in international format
   * @param message - Message to send
   */
  async sendWhatsAppMessage(phoneNumber: string, message: string): Promise<void> {
    try {
      const fromWhatsApp = this.configService.get<string>('TWILIO_WHATSAPP_FROM');
      const toWhatsApp = `whatsapp:${phoneNumber}`;

      const result = await this.twilioClient.messages.create({
        from: fromWhatsApp,
        to: toWhatsApp,
        body: message,
      });



    } catch (error) {

      throw new Error(`Failed to send WhatsApp message: ${error}`);
    }
  }

  /**
   * Format phone number to international format
   * @param phoneNumber - Phone number to format
   * @param countryCode - Country code (e.g., 'US', 'LB')
   */
  formatPhoneNumber(phoneNumber: string, countryCode?: string): string {
    // Remove all non-digit characters except +
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add country code
    if (!cleaned.startsWith('+')) {
      // You can add country code mapping here based on your needs
      // For now, assuming Lebanese numbers if no + is provided
      if (countryCode === 'LB' && !cleaned.startsWith('961')) {
        cleaned = '+961' + cleaned;
      } else if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned;
      }
    }

    return cleaned;
  }
}