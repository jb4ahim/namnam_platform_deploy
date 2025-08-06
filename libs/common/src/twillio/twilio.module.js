"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const twilio_whatsapp_service_1 = require("./twilio-whatsapp.service");
const twilio_sms_service_1 = require("./twilio-sms.service");
const logger_1 = require("../logger");
let TwilioModule = class TwilioModule {
};
exports.TwilioModule = TwilioModule;
exports.TwilioModule = TwilioModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            logger_1.LoggerModule
        ],
        providers: [twilio_whatsapp_service_1.TwilioWhatsAppService, twilio_sms_service_1.TwilioSmsService],
        exports: [twilio_whatsapp_service_1.TwilioWhatsAppService, twilio_sms_service_1.TwilioSmsService],
    })
], TwilioModule);
//# sourceMappingURL=twilio.module.js.map