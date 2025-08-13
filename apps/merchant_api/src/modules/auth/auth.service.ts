import { Injectable, UnauthorizedException, Inject, forwardRef, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { v4 as uuidv4 } from 'uuid';
// import { TwilioSmsService } from '@app/common';

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
  email: string;
  countryCode: string;
  phoneNumber: string;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable()
export class AuthService {
  // NEW: Updated session storage - now using sessionId as key
  private verificationSessions = new Map<string, VerificationSession>();
  // NEW: Helper map to find sessions by email or phone
  private sessionLookup = new Map<string, string>(); // Maps email/phone -> sessionId
  private registrationTokens = new Map<string, RegistrationToken>();

  constructor(
    private readonly jwtService: JwtService,

    private readonly authRepository: AuthRepository,
    // private readonly twilioService: TwilioSmsService
  ) {
    // NEW: Clean up expired sessions and tokens every 5 minutes
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }

  async sendOtp(sendOtpDto: SendOtpDto) {
    if (sendOtpDto.type === 'email' && sendOtpDto.email) {
      await this.authRepository.saveOtpEmail(sendOtpDto.email, '123456');
      
      // NEW: Create or find existing session
      const sessionId = this.getOrCreateSession(sendOtpDto.email, 'email');
      return { step: 1, sessionId };
    }

    if (sendOtpDto.type === 'phone' && sendOtpDto.phoneNumber && sendOtpDto.countryCode) {
      const phoneKey = sendOtpDto.countryCode + sendOtpDto.phoneNumber;
      await this.authRepository.saveOtpPhone(sendOtpDto.countryCode, sendOtpDto.phoneNumber, '123456');
      
      // NEW: If sessionId provided, add phone to existing session
      if (sendOtpDto.sessionId) {
        const existingSession = this.verificationSessions.get(sendOtpDto.sessionId);
        if (!existingSession) {
          throw new BadRequestException('Invalid session ID');
        }
        
        // Add phone info to existing session
        existingSession.countryCode = sendOtpDto.countryCode;
        existingSession.phoneNumber = sendOtpDto.phoneNumber;
        this.sessionLookup.set(phoneKey, sendOtpDto.sessionId);
        
        return { step: 2, sessionId: sendOtpDto.sessionId };
      } else {
        // Create new session for phone-only flow
        const sessionId = this.getOrCreateSession(phoneKey, 'phone', sendOtpDto.countryCode, sendOtpDto.phoneNumber);
        return { step: 2, sessionId };
      }
    }

    throw new BadRequestException('Invalid OTP request');
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    let destination: string;
    let lookupKey: string;

    // UPDATED: Proper validation and destination setting
    if (verifyOtpDto.type === 'email' && verifyOtpDto.email) {
      destination = verifyOtpDto.email;
      lookupKey = verifyOtpDto.email;
    } else if (verifyOtpDto.type === 'phone' && verifyOtpDto.countryCode && verifyOtpDto.phoneNumber) {
      destination = verifyOtpDto.countryCode + verifyOtpDto.phoneNumber;
      lookupKey = destination;
    } else {
      throw new BadRequestException('Invalid verification request');
    }

    // NEW: Verify OTP against database
    const isValidOtp = await this.authRepository.verifyOtp(destination, verifyOtpDto.type, verifyOtpDto.code);
    if (!isValidOtp) {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // NEW: Find the session using lookup
    const sessionId = this.sessionLookup.get(lookupKey);
    if (!sessionId) {
      throw new BadRequestException('Verification session not found');
    }

    const session = this.verificationSessions.get(sessionId);
    if (!session) {
      throw new BadRequestException('Verification session not found');
    }

    // NEW: Update the session based on verification type
    if (verifyOtpDto.type === 'email') {
      session.emailVerified = true;
    } else {
      session.phoneVerified = true;
    }

    // NEW: Check if both email and phone are verified
    if (session.emailVerified && session.phoneVerified && session.email && session.countryCode && session.phoneNumber) {
      // Generate registration token
      const registrationToken = uuidv4();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      this.registrationTokens.set(registrationToken, {
        email: session.email,
        countryCode: session.countryCode,
        phoneNumber: session.phoneNumber,
        createdAt: new Date(),
        expiresAt
      });

      // Clean up verification session and lookups
      this.verificationSessions.delete(sessionId);
      if (session.email) this.sessionLookup.delete(session.email);
      if (session.countryCode && session.phoneNumber) {
        this.sessionLookup.delete(session.countryCode + session.phoneNumber);
      }

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
      [verifyOtpDto.type + 'Verified']: true,
      sessionId: sessionId
    };
  }

  // UPDATED: Get email/phone from session, only collect new user info
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

      // NEW: Combine session data (verified email/phone) with user input
      const completeUserData = {
        email: tokenData.email,
        countryCode: tokenData.countryCode,
        phoneNumber: tokenData.phoneNumber,
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        role: registerUserDto.role
      };

      // Create user with complete data
      const userId = await this.authRepository.registerUser(completeUserData.email,completeUserData.countryCode, completeUserData.phoneNumber,completeUserData.firstName, completeUserData.lastName, completeUserData.role);
      
      // NEW: Generate JWT token with userId
      const payload = { userId };
      const access_token = this.jwtService.sign(payload);
      
      // NEW: Invalidate the registration token
      this.registrationTokens.delete(registerUserDto.registrationToken);
      
      return { 
        userId, 
        access_token,
        message: 'User registered successfully',
        // NEW: Return the verified email/phone for confirmation
        userData: {
          email: tokenData.email,
          phone: `${tokenData.countryCode}${tokenData.phoneNumber}`,
          firstName: registerUserDto.firstName,
          lastName: registerUserDto.lastName,
          role: registerUserDto.role
        }
      };

  }

  // NEW: Updated helper method for better session management
  private getOrCreateSession(lookupKey: string, type: 'email' | 'phone', countryCode?: string, phoneNumber?: string): string {
    // Check if session already exists for this email/phone
    let sessionId = this.sessionLookup.get(lookupKey);
    let session: VerificationSession;

    if (sessionId && this.verificationSessions.has(sessionId)) {
      // Update existing session
      session = this.verificationSessions.get(sessionId)!;
    } else {
      // Create new session
      sessionId = uuidv4();
      session = {
        sessionId,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date()
      };
      this.verificationSessions.set(sessionId, session);
    }

    // Update session data based on type
    if (type === 'email') {
      session.email = lookupKey;
      this.sessionLookup.set(lookupKey, sessionId);
    } else {
      session.countryCode = countryCode;
      session.phoneNumber = phoneNumber;
      this.sessionLookup.set(lookupKey, sessionId);
    }

    return sessionId;
  }

  // NEW: Updated cleanup for new session structure
  private cleanupExpired() {
    const now = new Date();
    const sessionExpiry = 30 * 60 * 1000; // 30 minutes for sessions

    // Clean up expired verification sessions
    for (const [sessionId, session] of this.verificationSessions.entries()) {
      if (now.getTime() - session.createdAt.getTime() > sessionExpiry) {
        // Clean up session lookup entries
        if (session.email) {
          this.sessionLookup.delete(session.email);
        }
        if (session.countryCode && session.phoneNumber) {
          this.sessionLookup.delete(session.countryCode + session.phoneNumber);
        }
        this.verificationSessions.delete(sessionId);
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