import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterManagementUserDto } from './dto/register-management-user.dto';
import { LoginManagementUserDto } from './dto/login-management-user.dto';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@app/auth/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository
  ) {}

  async register(dto: RegisterManagementUserDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);

    const result = await this.authRepository.insertManagementUser({
      name: dto.name,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      defaultCurrency: dto.defaultCurrency,
      countryCode: dto.countryCode,
      passwordHash
    });

    const payload = { managementUserId: result.management_user_id, userId: result.user_id };
    const { accessToken, refreshToken } = this.jwtService.generateTokenPair(payload);

    return {
      managementUserId: result.management_user_id,
      userId: result.user_id,
      accessToken,
      refreshToken
    };
  }

  async login(dto: LoginManagementUserDto) {
    const user = await this.authRepository.getManagementUserByEmail(dto.email);
    
    if (!user || !user.password_hash) {
      throw new Error('Invalid credentials');
    }

    const ok = await bcrypt.compare(dto.password, user.password_hash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    const payload = { managementUserId: user.management_user_id, userId: user.user_id };
    const  { accessToken, refreshToken } = this.jwtService.generateTokenPair(payload);

    return {
      managementUserId: user.management_user_id,
      accessToken,
      refreshToken
    };
  }
    async refreshToken(token: string) {
      const user = this.jwtService.verifyRefreshToken(token);
      
      
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      const newToken = this.jwtService.generateTokenPair({ userId: user.userId });

      return { ...newToken };
    }
}

