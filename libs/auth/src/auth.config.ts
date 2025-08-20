// libs/auth/src/auth.config.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthConfig {
  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }
    return secret;
  }

  get jwtRefreshSecret(): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET environment variable is not defined');
    }
    return secret;
  }
}