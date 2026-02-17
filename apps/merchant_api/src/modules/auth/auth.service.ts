import { Injectable, UnauthorizedException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { v4 as uuidv4 } from 'uuid';
import { MerchantService } from '../merchant/merchant.service';
import { JwtService } from '@app/auth/jwt.service';
import { isEmail } from 'class-validator';
// import { TwilioSmsService } from '@app/common';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';
import { ref } from 'process';

// NEW: Updated interfaces for better session management
interface VerificationSession {
  sessionId: string; // NEW: Unique session identifier
  email?: string;
  emailVerified: boolean;
  countryCode?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  createdAt: Date;
}

// NEW: Interface for registration tokens
interface RegistrationToken {
  countryCode: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  private verificationSessions = new Map<string, VerificationSession>();
  private sessionLookup = new Map<string, string>(); // Maps email/phone -> sessionId
  private registrationTokens = new Map<string, RegistrationToken>();

  constructor(
    private readonly authRepository: AuthRepository,
    @Inject(forwardRef(() => MerchantService))
    private readonly merchantService: MerchantService,
    private readonly jwtService: JwtService
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    // if (sendOtpDto.type === 'email' && sendOtpDto.email) {
    //   await this.authRepository.saveOtpEmail(sendOtpDto.email, '123456');
      
    //   // NEW: Create or find existing session
    //   const sessionId = this.getOrCreateSession(sendOtpDto.email, 'email');
    //   return { step: 1};
    // }

    // if (sendOtpDto.type === 'phone' && sendOtpDto.phoneNumber && sendOtpDto.countryCode) {
      await this.authRepository.saveOtpPhone(sendOtpDto.countryCode!, sendOtpDto.phoneNumber!, '123456');
    // }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    let destination = verifyOtpDto.countryCode + verifyOtpDto.phoneNumber;
    const isValidOtp = await this.authRepository.verifyOtp(destination, 'phone', verifyOtpDto.code);

    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired code');
    }

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
      // Clean up verification session and lookups
      const merchantData = await this.merchantService.getMerchant(verifyOtpDto.countryCode, verifyOtpDto.phoneNumber);
      if (merchantData != null) {
        return {
          isVerified: true,
          isRegistered: true,
          expiresAt: expiresAt.toISOString(),
          verifyToken: registrationToken
        };
      }
    return {
      isVerified: true,
      isRegistered: false,
      verifyToken: registrationToken
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const tokenData = this.registrationTokens.get(registerUserDto.verifyToken);
    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired verification  token');
    }
    if (new Date() > tokenData.expiresAt) {
      this.registrationTokens.delete(registerUserDto.verifyToken);
      throw new UnauthorizedException('Verification token has expired');
    }
    const completeUserData = {
      countryCode: tokenData.countryCode,
      phoneNumber: tokenData.phoneNumber,
      password: registerUserDto.password
    };
    const passwordHash = await bcrypt.hash(registerUserDto.password, 10);
    const merchantData = await this.merchantService.getMerchant(tokenData.countryCode, tokenData.phoneNumber);
    if (merchantData == null) {
      // Create user with complete data
      const userId = await this.authRepository.registerUser(completeUserData.countryCode, completeUserData.phoneNumber,  passwordHash);
      console.log('Registered userId:', userId);
      if (!userId) {
        throw new BadRequestException('User registration failed');
      }
      //  Generate JWT token with userId
      const payload = { userId: userId.userId, merchantId: userId.merchantId };
      const tokens = this.jwtService.generateTokenPair(payload);

      // this.registrationTokens.delete(registerUserDto.registrationToken);
      console.log('Generated tokens:', tokens);

      return {
        ...userId,
        ...tokens,
        message: 'User registered successfully'
      };
    } else {
      if (await bcrypt.compare(registerUserDto.password, merchantData.passwordHash)) {
        console.log('User logged in, userId:', merchantData.userId);
        const userId = merchantData.userId;
        const merchantId = merchantData.merchantId;
        const payload = { userId: userId, merchantId: merchantId };

        const tokens = this.jwtService.generateTokenPair(payload);
        return { 
          userId, 
          merchantId,
          ...tokens,
          steps: merchantData.steps,
          message: 'User Logged in successfully'
      };
      }else{
        throw new UnauthorizedException('Invalid credentials');
      }
    }

  }

  async setLocale(merchantId: number, locale: string) {
    // Here you would typically update the user's locale in the database
    await this.authRepository.setLocale(merchantId, locale);

  }

  async refreshToken(token: string) {
    const user = this.jwtService.verifyRefreshToken(token);
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    const newToken = this.jwtService.generateTokenPair({ userId: user.userId, merchantId: user.merchantId });
    return { ...newToken };
  }

  async updateFcmToken(fcmToken: string, userId:number) {
    await this.authRepository.updateFcmToken(userId, fcmToken);
    return { message: 'FCM token updated successfully' };
  }
}