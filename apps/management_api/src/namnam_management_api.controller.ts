import { Controller, Get } from '@nestjs/common';
import { NamnamManagementApiService } from './namnam_management_api.service';

@Controller()
export class NamnamManagementApiController {
  constructor(private readonly namnamManagementApiService: NamnamManagementApiService) {}

  @Get()
  getHello(): string {
    return this.namnamManagementApiService.getHello();
  }
}
