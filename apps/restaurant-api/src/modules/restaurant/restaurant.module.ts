import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { DatabaseModule } from '@namnam/database'; 

@Module({
  imports: [DatabaseModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [RestaurantService] 
})
export class RestaurantModule {}
