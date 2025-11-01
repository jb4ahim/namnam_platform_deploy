import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CurrentUserId } from '@app/common/decorators';
import { AuthGuard } from '@app/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('password')
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('fcm-token')
  @UseGuards(AuthGuard)
  async updateFcmToken(@Body() fcmTokenDto: { fcmToken: string }, @CurrentUserId() userId: number) {
    return this.authService.updateFcmToken(fcmTokenDto.fcmToken, userId);
  }

  @Post('set-locale')
  @UseGuards(AuthGuard)
  async setLocale(@Body() setLocaleDto: { locale: string }, @CurrentUserId() userId: number) {
    return this.authService.setLocale(userId, setLocaleDto.locale);
  }
}


