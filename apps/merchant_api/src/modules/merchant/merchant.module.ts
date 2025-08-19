import { Module } from '@nestjs/common';
import { MerchantController } from './merchant.controller';
import { MerchantService } from './merchant.service';
import { DatabaseModule } from '@app/database/database.module';

@Module({
  imports: [DatabaseModule], // Import DB module if using DI pattern
  controllers: [MerchantController],
  providers: [MerchantService],
  exports: [MerchantService] // Allows AuthService to inject UsersService
})
export class MerchantModule {}
