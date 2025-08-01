// src/common/twilio/twilio.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwilioWhatsAppService } from './twilio-whatsapp.service';
import { TwilioSmsService } from './twilio-sms.service';
import { LoggerModule } from '../logger';

@Module({
  imports: [
    ConfigModule,
    LoggerModule
  ],
  providers: [TwilioWhatsAppService, TwilioSmsService],
  exports: [TwilioWhatsAppService, TwilioSmsService],
})
export class TwilioModule {}