import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@app/auth';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DriverProfileResponseDto } from './dto/profile-response.dto';

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
}
