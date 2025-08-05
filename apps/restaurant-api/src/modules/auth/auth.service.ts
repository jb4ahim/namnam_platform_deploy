import { Injectable, UnauthorizedException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioSmsService } from '@namnam/common/twillio/twilio-sms.service';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { v4 as uuidv4 } from 'uuid';

// NEW: Interface for tracking verification sessions
interface VerificationSession {
  email?: string;
  emailVerified: boolean;
  countryCode?: string;
  phoneNumber?: string;
  phoneVerified: boolean;
  createdAt: Date;
}

// NEW: Interface for registration tokens
interface RegistrationToken {
  email: string;
  countryCode: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  // NEW: In-memory storage for verification sessions and registration tokens
  // In production, consider using Redis for scalability
  private verificationSessions = new Map<string, VerificationSession>();
  private registrationTokens = new Map<string, RegistrationToken>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly twilioService: TwilioSmsService
  ) {
    // NEW: Clean up expired sessions and tokens every 5 minutes
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    console.log(sendOtpDto);
    console.log(sendOtpDto.email);
    if (sendOtpDto.type === 'email' && sendOtpDto.email) {
      await this.authRepository.saveOtpEmail(sendOtpDto.email, '123456');
      console.log('accessed')
      // NEW: Create or update verification session
      const sessionId = this.getOrCreateSessionId(sendOtpDto.email, null, null);
      console.log('accessed 2 ')
      return { step: 1, sessionId };
    }

    if (sendOtpDto.type === 'phone' && sendOtpDto.phoneNumber && sendOtpDto.countryCode) {
      await this.authRepository.saveOtpPhone(sendOtpDto.countryCode, sendOtpDto.phoneNumber, '123456');
      
      // NEW: Create or update verification session  
      const sessionId = this.getOrCreateSessionId(null, sendOtpDto.countryCode, sendOtpDto.phoneNumber);
      return { step: 2, sessionId };
    }

    // throw new BadRequestException('Invalid OTP request');
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    let destination: string;
    let sessionKey: string;

    // UPDATED: Proper validation and destination setting
    if (verifyOtpDto.type === 'email' && verifyOtpDto.email) {
      destination = verifyOtpDto.email;
      sessionKey = verifyOtpDto.email;
    } else if (verifyOtpDto.type === 'phone' && verifyOtpDto.countryCode && verifyOtpDto.phoneNumber) {
      destination = verifyOtpDto.countryCode + verifyOtpDto.phoneNumber;
      sessionKey = destination;
    } else {
      throw new BadRequestException('Invalid verification request');
    }

    // NEW: Verify OTP against database
    const isValidOtp = await this.authRepository.verifyOtp(destination, verifyOtpDto.type, verifyOtpDto.code);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // NEW: Update verification session
    const session = this.verificationSessions.get(sessionKey);
    if (!session) {
      throw new BadRequestException('Verification session not found');
    }

    if (verifyOtpDto.type === 'email') {
      session.emailVerified = true;
    } else {
      session.phoneVerified = true;
    }

    // NEW: Check if both email and phone are verified
    if (session.emailVerified && session.phoneVerified) {
      // Generate registration token
      const registrationToken = uuidv4();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      this.registrationTokens.set(registrationToken, {
        email: session.email!,
        countryCode: session.countryCode!,
        phoneNumber: session.phoneNumber!,
        createdAt: new Date(),
        expiresAt
      });

      // Clean up verification session
      this.verificationSessions.delete(sessionKey);

      return {
        isVerified: true,
        bothVerified: true,
        registrationToken,
        expiresAt: expiresAt.toISOString()
      };
    }

    return {
      isVerified: true,
      bothVerified: false,
      [verifyOtpDto.type + 'Verified']: true
    };
  }

  // UPDATED: Extract registration token from DTO and return JWT
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

    // NEW: Ensure the registration data matches the verified email/phone
    if (registerUserDto.email !== tokenData.email ||
        registerUserDto.countryCode !== tokenData.countryCode ||
        registerUserDto.phoneNumber !== tokenData.phoneNumber) {
      throw new BadRequestException('Registration data does not match verified credentials');
    }

    try {
      // Create user
      const userId = await this.authRepository.registerUser(registerUserDto);
      
      // NEW: Generate JWT token with userId
      const payload = { userId };
      const access_token = this.jwtService.sign(payload);
      
      // NEW: Invalidate the registration token
      this.registrationTokens.delete(registerUserDto.registrationToken);
      
      return { 
        userId, 
        access_token,
        message: 'User registered successfully' 
      };
    } catch (error) {
      throw new BadRequestException('Failed to create user');
    }
  }

  // NEW: Helper method to get or create verification session
  private getOrCreateSessionId(email: string | null, countryCode: string | null, phoneNumber: string | null): string {
    let sessionKey: string;
    
    if (email) {
      sessionKey = email;
    } else if (countryCode && phoneNumber) {
      sessionKey = countryCode + phoneNumber;
    } else {
      throw new BadRequestException('Invalid session parameters');
    }

    let session = this.verificationSessions.get(sessionKey);
    if (!session) {
      session = {
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date()
      };
      this.verificationSessions.set(sessionKey, session);
    }

    // Update session data
    if (email) {
      session.email = email;
    }
    if (countryCode && phoneNumber) {
      session.countryCode = countryCode;
      session.phoneNumber = phoneNumber;
    }

    return sessionKey;
  }

  // NEW: Cleanup expired sessions and tokens
  private cleanupExpired() {
    const now = new Date();
    const sessionExpiry = 30 * 60 * 1000; // 30 minutes for sessions

    // Clean up expired verification sessions
    for (const [key, session] of this.verificationSessions.entries()) {
      if (now.getTime() - session.createdAt.getTime() > sessionExpiry) {
        this.verificationSessions.delete(key);
      }
    }

    // Clean up expired registration tokens
    for (const [token, tokenData] of this.registrationTokens.entries()) {
      if (now > tokenData.expiresAt) {
        this.registrationTokens.delete(token);
      }
    }
  }
}