import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtService } from '@app/auth/jwt.service';
// import { TwilioSmsService } from '@app/common';
// If using a cache (e.g., Redis), inject it or use your own storage solution
import { v4 as uuidv4 } from 'uuid';

interface RegistrationToken {
  countryCode: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    // private readonly twilioService: TwilioSmsService
    // private readonly cache: CacheService, // Optional cache for OTP
  ) {}
  private registrationTokens = new Map<string, RegistrationToken>();
  
  async sendOtp(sendOtpDto: SendOtpDto) {
     //
      await this.authRepository.saveOtpPhone(sendOtpDto.countryCode, sendOtpDto.phoneNumber, '123456');
    //  const phoneNumber = `${sendOtpDto.countryCode}${sendOtpDto.phoneNumber}`
    //  const result = await this.twilioService.sendOTPViaSMS(phoneNumber);
    // await this.authRepository.saveOtp(sendOtpDto.countryCode, sendOtpDto.phoneNumber, result);
    // console.log(result);
  }


  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    console.log('verifyOtpDto', verifyOtpDto);
    // if (code !== expectedCode)
    if (!verifyOtpDto.code || verifyOtpDto.code !== '123456') {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Find or create the user
    const phoneKey = verifyOtpDto.countryCode + verifyOtpDto.phoneNumber;
     // Generate registration token
    const registrationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    this.registrationTokens.set(
      registrationToken,
      {
        countryCode: verifyOtpDto.countryCode,
        phoneNumber: verifyOtpDto.phoneNumber,
        createdAt: new Date(),
        expiresAt
      });
    await this.authRepository.verifyOtp(phoneKey, verifyOtpDto.code);
    
    let userId = await this.usersService.findUserByPhone(verifyOtpDto.countryCode, verifyOtpDto.phoneNumber);
    console.log('userId', userId);
    if (userId) {
       // JWT
      const payload = { userId: userId};
      const tokens = this.jwtService.generateTokenPair(payload);
      return { isRegistered: true, ...tokens };
    }else{
      return { isRegistered: false , verifyToken: registrationToken, expiresAt: expiresAt.toISOString() };
    }
  }

  async registerWithPhone(registerUserDto: RegisterUserDto) {
    // Save OTP
    // await this.authRepository.saveOtp(verifyOtpDto.phone, verifyOtpDto.code);
    const tokenData = this.registrationTokens.get(registerUserDto.verifyToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired verification  token');
    }
    if (new Date() > tokenData.expiresAt) {
      this.registrationTokens.delete(registerUserDto.verifyToken);
      throw new UnauthorizedException('Verification token has expired');
    }
    // Create user if not exists
    const userId = await this.usersService.createUserWithPhone(registerUserDto, tokenData.countryCode, tokenData.phoneNumber);

    if (!userId) {
      throw new UnauthorizedException('User creation failed');
    }
    // Return JWT token
    const payload = { userId: userId };
    const tokens = this.jwtService.generateTokenPair(payload);
    return { ...tokens };
  }

  async refreshToken(token: string) {
    const user = this.jwtService.verifyRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const newToken = this.jwtService.generateTokenPair({ userId: user.userId});
    return { ...newToken };
  }
}


