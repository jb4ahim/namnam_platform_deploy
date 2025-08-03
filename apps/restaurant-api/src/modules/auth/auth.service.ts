import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TwilioSmsService } from '@namnam/common/twillio/twilio-sms.service';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// If using a cache (e.g., Redis), inject it or use your own storage solution

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly twilioService: TwilioSmsService
    // private readonly cache: CacheService, // Optional cache for OTP
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
     //
    //  const phoneNumber = `${sendOtpDto.countryCode}${sendOtpDto.phoneNumber}`
    //  const result = await this.twilioService.sendOTPViaSMS(phoneNumber);
    // await this.authRepository.saveOtp(sendOtpDto.countryCode, sendOtpDto.phoneNumber, result);
    // console.log(result);
  }


  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    // const expectedCode = await this.cache.get(`otp:${phone}`);
    // For demo, just accept any code (replace this with cache logic above)
    // if (code !== expectedCode)
    if (!verifyOtpDto.code || verifyOtpDto.code !== '123456') {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Find or create the user
    let userId = await this.usersService.findUserByPhone(verifyOtpDto.countryCode, verifyOtpDto.phoneNumber);

    if (userId) {
       // JWT
      const payload = { userId: userId};
    
      return { isRegistered: true, access_token: this.jwtService.sign(payload) };
    }else{
      return { isRegistered: false}
    }
  }


  async registerWithPhone(registerUserDto: RegisterUserDto) {
    // Save OTP
    // await this.authRepository.saveOtp(verifyOtpDto.phone, verifyOtpDto.code);

    // Create user if not exists
    const userId = await this.usersService.createUserWithPhone(registerUserDto);
    if (!userId) {
      throw new UnauthorizedException('User creation failed');
    }
    // Return JWT token
    const payload = { userId: userId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
