import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
// If using a cache (e.g., Redis), inject it or use your own storage solution

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository
  ) {}

  async findUserByPhone(countryCode: string, phoneNumber: string) {
    const user = await this.usersRepository.findUserByPhone(countryCode, phoneNumber);
    // if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
  
  async createUserWithPhone(registerUserDto: RegisterUserDto): Promise<number> {
    const userId = await this.usersRepository.createUserWithPhone(
      registerUserDto.countryCode, 
      registerUserDto.phoneNumber, 
      registerUserDto.firstName, 
      registerUserDto.lastName, 
      registerUserDto.email,
      registerUserDto.gender,
      registerUserDto.birthday ? new Date(registerUserDto.birthday) : undefined,
      registerUserDto.defaultCurrency,
      registerUserDto.status
    );
    return userId;
  }
  
  async getCustomerInfos(userId: number) {
    const user = await this.usersRepository.getCustomerInfos(userId);
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }


}
