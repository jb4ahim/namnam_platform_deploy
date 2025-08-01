import { Injectable } from '@nestjs/common';

// Replace with your UserEntity or Type
interface User {
  id: string;
  phone: string;
  [key: string]: any;
}

@Injectable()
export class UsersService {
  private users: User[] = []; // Replace with real DB logic

  async findByPhone(phone: string): Promise<User | undefined> {
    // Replace with real DB call, e.g.:
    // return this.userRepository.findOne({ where: { phone } });
    return this.users.find(u => u.phone === phone);
  }

  async createWithPhone(phone: string): Promise<User> {
    // Replace with real DB logic
    const newUser: User = {
      id: Math.random().toString(36).substring(2), // Replace with UUID or DB PK
      phone,
    };
    this.users.push(newUser);
    return newUser;
  }
}
