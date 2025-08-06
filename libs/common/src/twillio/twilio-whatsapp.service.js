"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioWhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = __importDefault(require("twilio"));
let TwilioWhatsAppService = class TwilioWhatsAppService {
    configService;
    twilioClient;
    constructor(configService) {
        this.configService = configService;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials are not configured');
        }
        this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
    }
    async sendOTPViaWhatsApp(phoneNumber, otp) {
        try {
            const fromWhatsApp = this.configService.get('TWILIO_WHATSAPP_FROM');
            const toWhatsApp = `whatsapp:${phoneNumber}`;
            const message = `Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share this code with anyone.`;
            const result = await this.twilioClient.messages.create({
                from: fromWhatsApp,
                to: toWhatsApp,
                body: message,
            });
        }
        catch (error) {
            throw new Error(`Failed to send WhatsApp OTP: ${error}`);
        }
    }
    async sendWhatsAppMessage(phoneNumber, message) {
        try {
            const fromWhatsApp = this.configService.get('TWILIO_WHATSAPP_FROM');
            const toWhatsApp = `whatsapp:${phoneNumber}`;
            const result = await this.twilioClient.messages.create({
                from: fromWhatsApp,
                to: toWhatsApp,
                body: message,
            });
        }
        catch (error) {
            throw new Error(`Failed to send WhatsApp message: ${error}`);
        }
    }
    formatPhoneNumber(phoneNumber, countryCode) {
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+')) {
            if (countryCode === 'LB' && !cleaned.startsWith('961')) {
                cleaned = '+961' + cleaned;
            }
            else if (!cleaned.startsWith('+')) {
                cleaned = '+' + cleaned;
            }
        }
        return cleaned;
    }
};
exports.TwilioWhatsAppService = TwilioWhatsAppService;
exports.TwilioWhatsAppService = TwilioWhatsAppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TwilioWhatsAppService);
//# sourceMappingURL=twilio-whatsapp.service.js.map