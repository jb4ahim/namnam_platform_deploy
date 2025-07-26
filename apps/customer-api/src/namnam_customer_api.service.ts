import { Injectable } from '@nestjs/common';

@Injectable()
export class NamnamCustomerApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
