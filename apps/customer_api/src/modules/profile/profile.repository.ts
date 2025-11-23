import { Injectable } from '@nestjs/common';
import { DatabaseUtils, PostgresService } from '@app/database';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

@Injectable()
export class ProfileRepository {
  constructor(private readonly pg: PostgresService) {}

  async getProfile(userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_user_profile',
      [userId],
      false
    );
    return result;
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_user_profile',
      [
        userId,
        dto.first_name || null,
        dto.last_name || null,
        dto.date_of_birth || null,
        dto.gender || null,
        dto.profile_image_url || null,
      ]
    );
    return { success: true, message: 'Profile updated successfully' };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_user_password',
      [userId, dto.current_password, dto.new_password]
    );
    return { success: true, message: 'Password changed successfully' };
  }

  async getPreferences(userId: number) {
    const result = await DatabaseUtils.callFunction(
      this.pg,
      'select_user_preferences',
      [userId],
      false
    );
    return result;
  }

  async updatePreferences(userId: number, dto: UpdatePreferencesDto) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'update_user_preferences',
      [
        userId,
        dto.language || null,
        dto.currency || null,
        dto.notifications_enabled ?? null,
        dto.email_notifications ?? null,
        dto.push_notifications ?? null,
        dto.sms_notifications ?? null,
        dto.marketing_emails ?? null,
        dto.theme || null,
        dto.timezone || null,
      ]
    );
    return { success: true, message: 'Preferences updated successfully' };
  }

  async deleteAccount(userId: number) {
    await DatabaseUtils.callProcedure(
      this.pg,
      'delete_user_account',
      [userId]
    );
    return { success: true, message: 'Account deleted successfully' };
  }
}
