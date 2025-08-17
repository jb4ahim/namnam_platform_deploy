import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  async list(@Req() req: any) {
    const userId = req.userId;
    return this.addressService.list(userId);
  }

  @Get(':id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    return this.addressService.getById(id);
  }

  @Post()
  async create(@Body() dto: CreateAddressDto) {
    return this.addressService.create(dto);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAddressDto) {
    return this.addressService.update(id, dto);
  }
}
