import { Controller, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile details' })
  @ApiResponse({ status: 200, description: 'Return current user profile.' })
  async getProfile(@CurrentUserId() userId: number) {
    return await this.profileService.getProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update current user profile details' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  async updateProfile(@CurrentUserId() userId: number, @Body() dto: UpdateProfileDto) {
    return await this.profileService.updateProfile(userId, dto);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Get user preferences' })
  @ApiResponse({ status: 200, description: 'Return user preferences.' })
  async getPreferences(@CurrentUserId() userId: number) {
    return await this.profileService.getPreferences(userId);
  }

  @Put('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiResponse({ status: 200, description: 'Preferences updated successfully.' })
  async updatePreferences(@CurrentUserId() userId: number, @Body() dto: UpdatePreferencesDto) {
    return await this.profileService.updatePreferences(userId, dto);
  }

  @Delete('account')
  @ApiOperation({ summary: 'Delete user account' })
  @ApiResponse({ status: 200, description: 'Account deleted successfully.' })
  async deleteAccount(@CurrentUserId() userId: number) {
    return await this.profileService.deleteAccount(userId);
  }
}
