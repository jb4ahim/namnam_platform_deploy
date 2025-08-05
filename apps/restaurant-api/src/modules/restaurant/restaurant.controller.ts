import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get(':phone')
  async getRestaurantInfos(@Param('phone') phone: string) {
    const user = await this.restaurantService.findUserByPhone(phone);
    if (!user) throw new NotFoundException('User not found');
  }

  // Add more endpoints (profile, update, etc.) as needed
}
