import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '@app/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customers')
  async getCustomers(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getCustomers(pagination, search);
  }

  @Get('merchants')
  async getMerchants(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getMerchants(pagination, search);
  }
}


