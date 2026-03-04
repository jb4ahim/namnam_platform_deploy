import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';
import { NamnamManagementApiModule } from './namnam_management_api.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

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

  await app.register(fastifyStatic, {
    root: join(__dirname, '..', '..', '..', 'node_modules', 'swagger-ui-dist'),
    prefix: '/swagger-static/',
    decorateReply: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Namnam Management API')
    .setDescription('The Management API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: '/swagger-static/swagger-ui.css',
    customJs: ['/swagger-static/swagger-ui-bundle.js', '/swagger-static/swagger-ui-standalone-preset.js'],
  });

  const port = process.env.PORT || '3003';
  await app.listen({ port: parseInt(port), host: '0.0.0.0' });
  console.log(`Management API running on port ${port}`);
}

bootstrap();