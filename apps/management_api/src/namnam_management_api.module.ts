import { Module } from '@nestjs/common';
import { NamnamManagementApiController } from './namnam_management_api.controller';
import { NamnamManagementApiService } from './namnam_management_api.service';

@Module({
  imports: [],
  controllers: [NamnamManagementApiController],
  providers: [NamnamManagementApiService],
})
export class NamnamManagementApiModule {}
