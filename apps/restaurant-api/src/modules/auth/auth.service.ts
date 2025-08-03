import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TwilioSmsService } from '@namnam/common/twillio/twilio-sms.service';
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

  async sendOtp(phone: string) {
    await this 
    // const result = await this.twilioService.sendOTPViaSMS(phone);
    // console.log(result);
  }


  async verifyOtp(phone: string, code: string) {
    // const expectedCode = await this.cache.get(`otp:${phone}`);
    // For demo, just accept any code (replace this with cache logic above)
    // if (code !== expectedCode)
    if (!code || code !== '123456') {
      throw new UnauthorizedException('Invalid or expired code');
    }

    // Find or create the user
    let user = await this.usersService.findByPhone(phone);

    if (!user) {
      user = await this.usersService.createWithPhone(phone);
    }

    // JWT
    const payload = { sub: user.id, phone: user.phone };
    return { access_token: this.jwtService.sign(payload) };
  }
}
