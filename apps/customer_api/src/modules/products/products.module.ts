import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { StorageModule } from '@app/storage';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [DatabaseModule, JwtModule, StorageModule],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository],
    exports: [ProductsService],
})
export class ProductsModule {}
