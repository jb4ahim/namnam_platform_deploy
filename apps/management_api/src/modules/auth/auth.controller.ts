import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterManagementUserDto } from './dto/register-management-user.dto';
import { LoginManagementUserDto } from './dto/login-management-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new management user' })
  @ApiBody({ type: RegisterManagementUserDto, description: 'User registration details' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Validation failed or user already exists.' })
  async register(@Body() dto: RegisterManagementUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login management user' })
  @ApiBody({ type: LoginManagementUserDto, description: 'User login credentials' })
  @ApiResponse({ status: 200, description: 'Token generated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized or invalid credentials.' })
  async login(@Body() dto: LoginManagementUserDto) {
    return this.authService.login(dto);
  }
  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ schema: { type: 'object', properties: { refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1...' } } }, description: 'The refresh token' })
  @ApiResponse({ status: 200, description: 'New access token generated successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(@Body() refreshTokenDto: { refreshToken: string }) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

}

