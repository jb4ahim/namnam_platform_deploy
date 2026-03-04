import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '@app/common';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('customers')
  @ApiOperation({ summary: 'Retrieve a paginated list of customers' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Optional search term to filter customers by name or email', example: 'john@example.com' })
  @ApiResponse({ status: 200, description: 'Paginated list of customers returned successfully.' })
  async getCustomers(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getCustomers(pagination, search);
  }

  @Get('merchants')
  @ApiOperation({ summary: 'Retrieve a paginated list of merchants' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Optional search term to filter merchants by name', example: 'Burger Shop' })
  @ApiResponse({ status: 200, description: 'Paginated list of merchants returned successfully.' })
  async getMerchants(@Query() pagination: PaginationQueryDto, @Query('search') search?: string) {
    return this.usersService.getMerchants(pagination, search);
  }
}


