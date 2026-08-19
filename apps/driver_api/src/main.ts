import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import fastifyApiReference from '@scalar/fastify-api-reference';
import { NamnamDriverApiModule } from './namnam_driver_api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamDriverApiModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('NamNam Driver API')
    .setDescription('The API documentation for the NamNam Driver Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.register(fastifyApiReference, {
    routePrefix: '/api/reference',
    configuration: { url: '/api/docs-json' },
  });

  const port = process.env.DRIVER_PORT || process.env.PORT || '3004';

  await app.listen({ port: parseInt(port), host: '0.0.0.0' });

  console.log(`Driver API is running on port ${port}`);
  console.log('URL:', await app.getUrl());
}
bootstrap();
