import { Controller, Get, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user basic info' })
  @ApiResponse({ status: 200, description: 'Return current user info.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async getUserInfos(@Req() req: any, @CurrentUserId() userId: number) {
    const user = await this.usersService.getCustomerInfos(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

}