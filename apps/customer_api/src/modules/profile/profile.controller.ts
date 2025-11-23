import { Controller, Get, Put, Delete, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(@CurrentUserId() userId: number) {
    return await this.profileService.getProfile(userId);
  }

  @Put('profile')
  async updateProfile(@CurrentUserId() userId: number, @Body() dto: UpdateProfileDto) {
    return await this.profileService.updateProfile(userId, dto);
  }

  @Put('password')
  async changePassword(@CurrentUserId() userId: number, @Body() dto: ChangePasswordDto) {
    return await this.profileService.changePassword(userId, dto);
  }

  @Get('preferences')
  async getPreferences(@CurrentUserId() userId: number) {
    return await this.profileService.getPreferences(userId);
  }

  @Put('preferences')
  async updatePreferences(@CurrentUserId() userId: number, @Body() dto: UpdatePreferencesDto) {
    return await this.profileService.updatePreferences(userId, dto);
  }

  @Delete('account')
  async deleteAccount(@CurrentUserId() userId: number) {
    return await this.profileService.deleteAccount(userId);
  }
}
