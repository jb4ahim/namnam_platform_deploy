import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NamnamCustomerApiModule } from './namnam_customer_api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamCustomerApiModule,
    new FastifyAdapter()
  );
  await app.listen(3000, '0.0.0.0'); // for external connections
}
bootstrap();
