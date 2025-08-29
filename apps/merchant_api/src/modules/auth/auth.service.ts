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

    if (sendOtpDto.type === 'phone' && sendOtpDto.phoneNumber && sendOtpDto.countryCode) {
      await this.authRepository.saveOtpPhone(sendOtpDto.countryCode, sendOtpDto.phoneNumber, '123456');
    }
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
        const tokens = this.jwtService.generateTokenPair({ userId: merchantData.userId });
        return {
          isVerified: true,
          steps: merchantData.steps,
          expiresAt: expiresAt.toISOString(),
          ...tokens
        };
      }



    return {
      isVerified: true,
      isRegistered: false
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    // NEW: Validate registration token
    const tokenData = this.registrationTokens.get(registerUserDto.registrationToken);

    if (!tokenData) {
      throw new UnauthorizedException('Invalid or expired registration token');
    }

    if (new Date() > tokenData.expiresAt) {
      this.registrationTokens.delete(registerUserDto.registrationToken);
      throw new UnauthorizedException('Registration token has expired');
    }

      const completeUserData = {
        countryCode: tokenData.countryCode,
        phoneNumber: tokenData.phoneNumber,
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        role: registerUserDto.role,
        password: registerUserDto.password
      };
       const passwordHash = await bcrypt.hash(registerUserDto.password, 10);
      // Create user with complete data
      const userId = await this.authRepository.registerUser(completeUserData.countryCode, completeUserData.phoneNumber, completeUserData.firstName, completeUserData.lastName, completeUserData.role, passwordHash);

      // NEW: Generate JWT token with userId
      const payload = { userId };
      const tokens = this.jwtService.generateTokenPair(payload);
      // this.registrationTokens.delete(registerUserDto.registrationToken);
      console.log('Generated tokens:', tokens);

      return { 
        userId, 
        tokens,
        message: 'User registered successfully',
        // NEW: Return the verified email/phone for confirmation
        userData: {
          phone: `${tokenData.countryCode}${tokenData.phoneNumber}`,
          firstName: registerUserDto.firstName,
          lastName: registerUserDto.lastName,
          role: registerUserDto.role
        }
      };

  }


  async refreshToken(token: string) {
    const userId = this.jwtService.verifyRefreshToken(token);
    console.log(userId);
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    const newToken = this.jwtService.generateTokenPair({ userId });

    return { ...newToken };
  }
}