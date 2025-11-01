import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [DatabaseModule, JwtModule],
    controllers: [CartController],
    providers: [CartService, CartRepository],
    exports: [CartService],
})
export class CartModule {}
