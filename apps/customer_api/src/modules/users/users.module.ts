import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '@app/database/database.module';
import { UsersRepository } from './users.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule], 
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService]
})
export class UsersModule {}
