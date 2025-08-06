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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategyWithConfig = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_strategy_1 = require("@nestjs/passport/dist/passport/passport.strategy");
const passport_jwt_1 = require("passport-jwt");
let JwtStrategyWithConfig = class JwtStrategyWithConfig extends (0, passport_strategy_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    constructor(configService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_SECRET', { infer: true }),
        });
        this.configService = configService;
        if (!this.configService.get('JWT_SECRET')) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
    }
    async validate(payload) {
        return { userId: payload.sub, email: payload.email, roles: payload.roles };
    }
};
exports.JwtStrategyWithConfig = JwtStrategyWithConfig;
exports.JwtStrategyWithConfig = JwtStrategyWithConfig = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], JwtStrategyWithConfig);
//# sourceMappingURL=jwt.strategy.js.map