import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core/constants';

import { AuthModule } from './modules/auth/auth.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { LoggerModule } from '@app/common';
import { GlobalExceptionFilter } from '@app/common';
import { ResponseEnvelopeInterceptor } from '@app/common';

@Module({
  imports: [LoggerModule, AuthModule, UploadsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseEnvelopeInterceptor,
    }
  ]
})
export class AppModule {}
