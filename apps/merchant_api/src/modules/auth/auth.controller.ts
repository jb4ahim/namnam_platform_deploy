import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CurrentUserId } from '@app/common/decorators';
import { AuthGuard } from '@app/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to phone number' })
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    return await this.authService.sendOtp(sendOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('password')
  @ApiOperation({ summary: 'Register user with password' })
  async registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh authentication token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } }, required: ['refreshToken'] } })
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @Post('fcm-token')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FCM token for push notifications' })
  @ApiBody({ schema: { properties: { fcmToken: { type: 'string' } }, required: ['fcmToken'] } })
  async updateFcmToken(@Body() fcmTokenDto: { fcmToken: string }, @CurrentUserId() userId: number) {
    return this.authService.updateFcmToken(fcmTokenDto.fcmToken, userId);
  }

  @Post('set-locale')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set user locale' })
  @ApiBody({ schema: { properties: { locale: { type: 'string', example: 'en' } }, required: ['locale'] } })
  async setLocale(@Body() setLocaleDto: { locale: string }, @CurrentUserId() userId: number) {
    return this.authService.setLocale(userId, setLocaleDto.locale);
  }
}


