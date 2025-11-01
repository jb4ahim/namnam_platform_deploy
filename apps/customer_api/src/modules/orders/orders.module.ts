import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrdersRepository } from './orders.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService],
})
export class OrdersModule {}
