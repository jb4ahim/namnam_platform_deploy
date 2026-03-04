import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressService } from './address.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';

@ApiTags('Address')
@ApiBearerAuth()
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List all user addresses' })
  @ApiResponse({ status: 200, description: 'Return list of addresses.' })
  async list(@CurrentUserId() userId: number) {
    return this.addressService.list(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a specific address by ID' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Return address.' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address created successfully.' })
  async create(@CurrentUserId() userId: number, @Body() dto: CreateAddressDto) {
    return this.addressService.create(userId, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update an existing address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully.' })
  async update(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully.' })
  async delete(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressService.delete(userId, id);
  }

  @Get('allowed-zones')
  @ApiOperation({ summary: 'Get allowed delivery zones' })
  @ApiResponse({ status: 200, description: 'Return allowed zones.' })
  async getAllowedZones() {
    return this.addressService.getAllowedZones();
  }

  @Patch(':id/set-default')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Set an address as default' })
  @ApiParam({ name: 'id', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address set as default.' })
  async setDefault(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressService.setDefault(userId, id);
  }
}
