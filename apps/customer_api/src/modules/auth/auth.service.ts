import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { AuthRepository } from './auth.repository';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
// import { TwilioSmsService } from '@app/common';
// If using a cache (e.g., Redis), inject it or use your own storage solution

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

    await this.authRepository.verifyOtp(phoneKey, verifyOtpDto.code);
    
    let userId = await this.usersService.findUserByPhone(verifyOtpDto.countryCode, verifyOtpDto.phoneNumber);
    console.log('user', userId);
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
    console.log('userId', userId);
    if (!userId) {
      throw new UnauthorizedException('User creation failed');
    }
    // Return JWT token
    const payload = { userId: userId };
    return { access_token: this.jwtService.sign(payload) };
  }
  async refreshToken(token: string) {
    const userId = this.jwtService.verify(token);
    if (!userId) {
      throw new UnauthorizedException('Invalid token');
    }
    const newToken = this.jwtService.sign({ userId });
    return { access_token: newToken };
  }
}
