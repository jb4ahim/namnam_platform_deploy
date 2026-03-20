import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DriverProfileResponseDto } from './dto/profile-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @ApiOperation({ summary: 'Get driver profile' })
  @ApiResponse({ status: 200, description: 'Driver profile returned.', type: DriverProfileResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Driver not found.' })
  async getProfile(@Request() req: any) {
    return this.profileService.getProfile(req.user.userId);
  }

  @Patch()
  @ApiOperation({ summary: 'Update driver profile' })
  @ApiResponse({ status: 200, description: 'Profile updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    await this.profileService.updateProfile(req.user.userId, dto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change password — clears the firstLogin flag' })
  @ApiResponse({ status: 201, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Current password incorrect or no password set.' })
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    await this.profileService.changePassword(req.user.userId, dto);
  }
}
