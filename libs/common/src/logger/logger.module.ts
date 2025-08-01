import { Module, Global } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Global() // Optional: Makes LoggerService globally available
@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Ensure LoggerService is exported
})
export class LoggerModule {}
