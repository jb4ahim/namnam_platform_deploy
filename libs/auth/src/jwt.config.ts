// libs/jwt/src/jwt.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfig {
  constructor(private configService: ConfigService) {}

  get accessTokenSecret(): string {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    return secret;
  }

  get refreshTokenSecret(): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
    }
    return secret;
  }

  get accessTokenExpiry(): string {
    return this.configService.get<string>('JWT_ACCESS_EXPIRY') || '15m';
  }

  get refreshTokenExpiry(): string {
    return this.configService.get<string>('JWT_REFRESH_EXPIRY') || '7d';
  }

  get issuer(): string {
    return this.configService.get<string>('JWT_ISSUER') || 'namnam-platform';
  }

  get audience(): string {
    return this.configService.get<string>('JWT_AUDIENCE') || 'namnam-users';
  }
}