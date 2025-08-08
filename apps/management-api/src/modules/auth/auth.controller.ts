import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterManagementUserDto } from './dto/register-management-user.dto';
import { LoginManagementUserDto } from './dto/login-management-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterManagementUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginManagementUserDto) {
    return this.authService.login(dto);
  }
}

