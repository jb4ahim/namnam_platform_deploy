// libs/jwt/src/jwt.service.ts
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtConfig } from './jwt.config';

export interface TokenPayload {
  sub: string; // user id
  email?: string;
  roles?: string[];
  merchantId?: string;
  type?: 'access' | 'refresh';
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
  [key: string]: any;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtSignOptions {
  expiresIn?: string;
  issuer?: string;
  audience?: string;
  subject?: string;
}

@Injectable()
export class JwtService {
  constructor(private config: JwtConfig) {}

  /**
   * Generate both access and refresh tokens
   */
  generateTokenPair(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>): TokenPair {
    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);
    
    // Calculate expiry time in seconds
    const expiresIn = this.parseExpiry(this.config.accessTokenExpiry);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Sign access token
   */
  signAccessToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>, options?: JwtSignOptions): string {
    const tokenPayload: TokenPayload = {
      ...payload,
      type: 'access',
      sub: ''
    };

    return jwt.sign(tokenPayload, this.config.accessTokenSecret, {
      expiresIn: options?.expiresIn || this.config.accessTokenExpiry,
      issuer: options?.issuer || this.config.issuer,
      audience: options?.audience || this.config.audience,
      subject: options?.subject || payload.sub,
    });
  }

  /**
   * Sign refresh token
   */
  signRefreshToken(payload: Omit<TokenPayload, 'type' | 'iat' | 'exp'>, options?: JwtSignOptions): string {
    const tokenPayload: TokenPayload = {
      ...payload,
      type: 'refresh',
      sub: ''
    };

    return jwt.sign(tokenPayload, this.config.refreshTokenSecret, {
      expiresIn: options?.expiresIn || this.config.refreshTokenExpiry,
      issuer: options?.issuer || this.config.issuer,
      audience: options?.audience || this.config.audience,
      subject: options?.subject || payload.sub,
    });
  }

  /**
   * Verify access token
   */
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, this.config.accessTokenSecret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
      }) as TokenPayload;

      if (payload.type !== 'access') {
        return null;
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Verify refresh token
   */
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const payload = jwt.verify(token, this.config.refreshTokenSecret, {
        issuer: this.config.issuer,
        audience: this.config.audience,
      }) as TokenPayload;

      if (payload.type !== 'refresh') {
        return null;
      }

      return payload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Decode token without verification (useful for expired tokens)
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (err) {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  }

  /**
   * Get token expiry date
   */
  getTokenExpiry(token: string): Date | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    
    return new Date(decoded.exp * 1000);
  }

  /**
   * Refresh access token using refresh token
   */
  refreshAccessToken(refreshToken: string): { accessToken: string; expiresIn: number } | null {
    const payload = this.verifyRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Remove JWT specific fields for new token
    const { iat, exp, type, ...cleanPayload } = payload;
    
    const accessToken = this.signAccessToken(cleanPayload);
    const expiresIn = this.parseExpiry(this.config.accessTokenExpiry);

    return {
      accessToken,
      expiresIn,
    };
  }

  /**
   * Parse expiry string to seconds
   */
  private parseExpiry(expiry: string): number {
    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) return 900; // default 15 minutes

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return 900;
    }
  }
}