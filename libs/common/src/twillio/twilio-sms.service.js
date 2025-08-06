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
exports.TwilioSmsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_1 = __importDefault(require("twilio"));
const logger_1 = require("../logger");
let TwilioSmsService = class TwilioSmsService {
    configService;
    logger;
    twilioClient;
    verifyServiceSid;
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
        const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
        const verifyServiceSid = this.configService.get('TWILIO_VERIFY_SERVICE_SID');
        if (!accountSid || !authToken) {
            throw new Error('Twilio credentials are not configured');
        }
        if (!verifyServiceSid) {
            throw new Error('Twilio Verify Service SID is not configured');
        }
        this.verifyServiceSid = verifyServiceSid;
        this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
    }
    async sendOTPViaSMS(phoneNumber) {
        try {
            const verification = await this.twilioClient.verify.v2
                .services(this.verifyServiceSid)
                .verifications.create({
                to: phoneNumber,
                channel: 'sms'
            });
            this.logger.debug('OTP sent via Verify service', {
                phoneNumber,
                sid: verification.sid,
                status: verification.status,
                channel: verification.channel
            });
        }
        catch (error) {
            this.logger.error('Failed to send OTP via Verify service', {
                phoneNumber,
                error: error
            });
            throw new Error(`Failed to send OTP: ${error}`);
        }
    }
    async verifyOTP(phoneNumber, code) {
        try {
            const verification = await this.twilioClient.verify.v2
                .services(this.verifyServiceSid)
                .verificationChecks.create({
                to: phoneNumber,
                code: code
            });
            this.logger.debug('OTP verification attempt', {
                phoneNumber,
                status: verification.status,
                valid: verification.valid
            });
            return verification.status === 'approved';
        }
        catch (error) {
            this.logger.error('Failed to verify OTP', {
                phoneNumber,
                error: error,
            });
            throw new Error(`Failed to verify OTP: ${error}`);
        }
    }
    async sendSMS(phoneNumber, message) {
        try {
            const ALPHANUMERIC_ID = 'NamNam';
            const result = await this.twilioClient.messages.create({
                from: ALPHANUMERIC_ID,
                to: phoneNumber,
                body: message
            });
            this.logger.info('SMS sent successfully', {
                phoneNumber,
                messageSid: result.sid,
                status: result.status
            });
        }
        catch (error) {
            this.logger.error('Failed to send SMS', {
                phoneNumber,
                error: error.message,
                errorCode: error.code,
                moreInfo: error.moreInfo
            });
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }
    formatPhoneNumber(phoneNumber, defaultCountryCode = '961') {
        let cleaned = phoneNumber.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+')) {
            if (cleaned.startsWith('00')) {
                cleaned = '+' + cleaned.substring(2);
            }
            else if (cleaned.startsWith('0')) {
                cleaned = '+' + defaultCountryCode + cleaned.substring(1);
            }
            else if (!cleaned.startsWith(defaultCountryCode)) {
                cleaned = '+' + defaultCountryCode + cleaned;
            }
            else {
                cleaned = '+' + cleaned;
            }
        }
        return cleaned;
    }
    isValidPhoneNumber(phoneNumber) {
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
    }
};
exports.TwilioSmsService = TwilioSmsService;
exports.TwilioSmsService = TwilioSmsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_1.LoggerService])
], TwilioSmsService);
//# sourceMappingURL=twilio-sms.service.js.map