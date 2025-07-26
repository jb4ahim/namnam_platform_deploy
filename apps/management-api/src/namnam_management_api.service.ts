import { Injectable } from '@nestjs/common';

@Injectable()
export class NamnamManagementApiService {
  getHello(): string {
    return 'Hello World!';
  }
}
