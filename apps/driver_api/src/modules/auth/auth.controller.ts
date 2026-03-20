import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @ApiOperation({ summary: 'Send OTP to driver phone number' })
  @ApiResponse({ status: 201, description: 'OTP sent successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid phone number format.' })
  async sendOtp(@Body() dto: SendOtpDto) {
    await this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP code' })
  @ApiResponse({ status: 201, description: 'OTP verified. Returns JWT or registration token.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP.' })
  async verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Complete driver registration after OTP verification' })
  @ApiResponse({ status: 201, description: 'Driver registered successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired verification token.' })
  async register(@Body() dto: RegisterDriverDto) {
    return this.authService.registerDriver(dto);
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { type: 'object', properties: { token: { type: 'string', example: 'eyJhb...' } } } })
  @ApiResponse({ status: 201, description: 'New access token generated.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(@Body() body: { token: string }) {
    return this.authService.refreshToken(body.token);
  }
}
