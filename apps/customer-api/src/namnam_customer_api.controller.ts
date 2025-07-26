import { Controller, Get } from '@nestjs/common';
import { NamnamCustomerApiService } from './namnam_customer_api.service';

@Controller()
export class NamnamCustomerApiController {
  constructor(private readonly namnamCustomerApiService: NamnamCustomerApiService) {}

  @Get()
  getHello(): string {
    return this.namnamCustomerApiService.getHello();
  }
}
