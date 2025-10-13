import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import { ValidationPipe } from '@nestjs/common';
import { NamnamManagementApiModule } from './namnam_management_api.module';

async function bootstrap() {
  const adapter = new FastifyAdapter();

  await adapter.register(multipart, {
    attachFieldsToBody: false,
    limits: {
      fileSize: 2 * 1024 * 1024,
      files: 1
    }
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamManagementApiModule,
    adapter
  );
  app.setGlobalPrefix('api');
  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  const port = process.env.PORT || '3003';
  await app.listen({ port: parseInt(port), host: '0.0.0.0' });
  console.log(`Management API running on port ${port}`);
}

bootstrap();