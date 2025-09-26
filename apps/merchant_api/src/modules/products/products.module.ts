import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { StorageModule } from '@app/storage';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, StorageModule, forwardRef(() => AuthModule)],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService],
})
export class ProductsModule {}