import { Injectable, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@app/auth/jwt.service';
import { AuthRepository } from './auth.repository';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';

interface RegistrationToken {
  countryCode: string;
  phoneNumber: string;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private registrationTokens = new Map<string, RegistrationToken>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    await this.authRepository.saveOtpPhone(dto.countryCode, dto.phoneNumber, '123456');
  }

  async verifyOtp(dto: VerifyOtpDto) {
    if (!dto.code || dto.code !== '123456') {
      throw new UnauthorizedException('Invalid or expired code');
    }

    await this.authRepository.verifyOtp(dto.countryCode + dto.phoneNumber, dto.code);

    const driverId = await this.authRepository.findDriverByPhone(dto.countryCode, dto.phoneNumber);

    if (driverId) {
      const tokens = this.jwtService.generateTokenPair({ userId: driverId });
      return { isRegistered: true, ...tokens };
    }

    const registrationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    this.registrationTokens.set(registrationToken, {
      countryCode: dto.countryCode,
      phoneNumber: dto.phoneNumber,
      expiresAt,
    });

    return { isRegistered: false, verifyToken: registrationToken, expiresAt: expiresAt.toISOString() };
  }

  async registerDriver(dto: RegisterDriverDto) {
    const tokenData = this.registrationTokens.get(dto.verifyToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired verification token');
    }
    if (new Date() > tokenData.expiresAt) {
      this.registrationTokens.delete(dto.verifyToken);
      throw new UnauthorizedException('Verification token has expired');
    }

    const driverId = await this.authRepository.createDriverWithPhone(
      tokenData.countryCode,
      tokenData.phoneNumber,
      dto.firstName,
      dto.lastName,
    );

    await this.authRepository.createDriverProfile(driverId, dto.vehicleType, dto.licensePlate);

    this.registrationTokens.delete(dto.verifyToken);

    const tokens = this.jwtService.generateTokenPair({ userId: driverId });
    return { ...tokens };
  }

  async refreshToken(token: string) {
    const payload = this.jwtService.verifyRefreshToken(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }
    return { ...this.jwtService.generateTokenPair({ userId: payload.userId }) };
  }
}
