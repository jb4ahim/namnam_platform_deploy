import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@namnam/database'; // DI for DB access

@Module({
  imports: [DatabaseModule], // Import DB module if using DI pattern
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Allows AuthService to inject UsersService
})
export class UsersModule {}
