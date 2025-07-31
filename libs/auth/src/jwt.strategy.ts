// Solution 4: Using ConfigService (Best practice for NestJS)
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport/dist/passport/passport.strategy';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategyWithConfig extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', { infer: true })!,
    });
    // At runtime, also validate:
    if (!this.configService.get<string>('JWT_SECRET')) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
  }

  async validate(payload: any) {
    return { userId: payload.sub, email: payload.email, roles: payload.roles };
  }
}
