import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterManagementUserDto } from './dto/register-management-user.dto';
import { LoginManagementUserDto } from './dto/login-management-user.dto';
import * as bcrypt from 'bcrypt';

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
    const access_token = this.jwtService.sign(payload);

    return {
      management_user_id: result.management_user_id,
      user_id: result.user_id,
      access_token
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
    const access_token = this.jwtService.sign(payload);

    return {
      management_user_id: user.management_user_id,
      user_id: user.user_id,
      access_token
    };
  }
}

