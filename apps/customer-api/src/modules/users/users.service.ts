import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TwilioSmsService } from '@namnam/common/twillio/twilio-sms.service';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
// If using a cache (e.g., Redis), inject it or use your own storage solution

@Injectable()
export class UsersService {

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository
    // private readonly cache: CacheService, // Optional cache for OTP
  ) {}

  async findUserByPhone(countryCode: string, phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhone(countryCode, phoneNumber);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
  async createUserWithPhone(registerUserDto: RegisterUserDto): Promise<number> {
    const userId = await this.usersRepository.createUserWithPhone(registerUserDto.countryCode, registerUserDto.phoneNumber, registerUserDto.firstName, registerUserDto.lastName, registerUserDto.email);
    return userId;
  }
  
  async getCustomerInfos(userId: number) {
    const user = await this.usersRepository.getCustomerInfos(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }


}
