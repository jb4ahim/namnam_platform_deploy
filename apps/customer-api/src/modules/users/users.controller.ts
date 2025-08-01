import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//   @Get(':phone')
//   async getUserByPhone(@Param('phone') phone: string) {
//     const user = await this.usersService.findByPhone(phone);
//     if (!user) throw new NotFoundException('User not found');
//     return user;
//   }

  // Add more endpoints (profile, update, etc.) as needed
}
