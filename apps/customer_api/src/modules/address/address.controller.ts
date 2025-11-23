import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressService } from './address.service';
import { AuthGuard } from '@app/auth/jwt-auth.guard';
import { CurrentUserId } from '@app/common/decorators';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @UseGuards(AuthGuard)
  async list(@CurrentUserId() userId: number) {
    return this.addressService.list(userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(@CurrentUserId() userId: number, @Body() dto: CreateAddressDto) {
    return this.addressService.create(userId, dto);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async update(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(userId, id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressService.delete(userId, id);
  }

  @Get('allowed-zones')
  async getAllowedZones() {
    return this.addressService.getAllowedZones();
  }

  @Patch(':id/set-default')
  @UseGuards(AuthGuard)
  async setDefault(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return this.addressService.setDefault(userId, id);
  }
}
