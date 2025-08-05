import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { NamnamManagementApiModule } from './namnam_management_api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamManagementApiModule,
    new FastifyAdapter()
  );
  await app.listen(3003, '0.0.0.0');
}
bootstrap();
