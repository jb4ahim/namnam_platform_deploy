import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioSmsService } from '@namnam/common/twillio/twilio-sms.service';
import { RestaurantRepository } from './restaurant.repository';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
// If using a cache (e.g., Redis), inject it or use your own storage solution

@Injectable()
export class RestaurantService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly restaurantRepository: RestaurantRepository
  ) {}

  async findUserByPhone(countryCode?: string, phoneNumber?: string, email?: string) {
    const user = await this.restaurantRepository.findUserByPhone(countryCode, phoneNumber, email);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
  
  async createUser(registerUserDto: RegisterUserDto): Promise<number> {
    const userId = await this.restaurantRepository.createUser(registerUserDto.countryCode, registerUserDto.phoneNumber, registerUserDto.firstName, registerUserDto.lastName, registerUserDto.email);
    return userId;
  }
  
  async getRestaurantInfos(userId: number) {
    const user = await this.restaurantRepository.getRestaurantInfos(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
