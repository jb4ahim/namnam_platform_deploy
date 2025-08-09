import { Controller, Get, Param, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUserInfos(@Req() req: any) {
    const userId = req.user.userId;
    const user = await this.usersService.getCustomerInfos(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  // Add more endpoints (profile, update, etc.) as needed
}
