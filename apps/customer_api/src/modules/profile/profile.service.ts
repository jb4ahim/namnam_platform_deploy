import { Injectable } from '@nestjs/common';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly repo: ProfileRepository) {}

  async getProfile(userId: number) {
    return this.repo.getProfile(userId);
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    return this.repo.updateProfile(userId, dto);
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    return this.repo.changePassword(userId, dto);
  }

  async getPreferences(userId: number) {
    return this.repo.getPreferences(userId);
  }

  async updatePreferences(userId: number, dto: UpdatePreferencesDto) {
    return this.repo.updatePreferences(userId, dto);
  }

  async deleteAccount(userId: number) {
    return this.repo.deleteAccount(userId);
  }
}
