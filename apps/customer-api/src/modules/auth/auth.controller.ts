import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Login — uses local strategy (username/password)
  @UseGuards()
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Register — creates a user, returns JWT
  @Post('register')
  async register(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.register(body);
  }
}
