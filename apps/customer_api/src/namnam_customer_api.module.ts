import { Module } from '@nestjs/common';
import { NamnamCustomerApiController } from './namnam_customer_api.controller';
import { NamnamCustomerApiService } from './namnam_customer_api.service';

@Module({
  imports: [],
  controllers: [NamnamCustomerApiController],
  providers: [NamnamCustomerApiService],
})
export class NamnamCustomerApiModule {}
