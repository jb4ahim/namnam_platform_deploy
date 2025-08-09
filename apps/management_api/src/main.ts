import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { NamnamManagementApiModule } from './namnam_management_api.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamManagementApiModule,
    new FastifyAdapter()
  );
   app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }));
  await app.listen({ port: 3003, host: '0.0.0.0' });
  console.log('URL:', await app.getUrl());
}
bootstrap();
