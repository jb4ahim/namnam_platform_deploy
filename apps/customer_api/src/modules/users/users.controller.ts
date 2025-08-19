import { Controller, Get, Param, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserInfos(@Req() req: any) {
    console.log(req);
    const userId = req.user.userId;
    const user = await this.usersService.getCustomerInfos(userId);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

}