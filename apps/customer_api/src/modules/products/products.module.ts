import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    imports: [DatabaseModule],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsRepository],
    exports: [ProductsService],
})
export class ProductsModule {}
