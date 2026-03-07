import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '@app/common';
import { PaginatedUsersDto } from './dto/user-response.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Retrieve a paginated list of customers' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Filter by name, email or phone', example: 'john@example.com' })
  @ApiResponse({ status: 200, type: PaginatedUsersDto, description: 'Paginated list of customers' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getCustomers(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getCustomers(pagination, search);
  }

  @Get('merchants')
  @ApiOperation({ summary: 'Retrieve a paginated list of merchants' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Filter by name or phone', example: 'Burger Shop' })
  @ApiResponse({ status: 200, type: PaginatedUsersDto, description: 'Paginated list of merchants' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMerchants(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getMerchants(pagination, search);
  }
}
