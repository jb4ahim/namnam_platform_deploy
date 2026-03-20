import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyApiReference from '@scalar/fastify-api-reference';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
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
    .setTitle('Namnam Merchant API')
    .setDescription('The Merchant API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customCssUrl: '/swagger-static/swagger-ui.css',
    customJs: ['/swagger-static/swagger-ui-bundle.js', '/swagger-static/swagger-ui-standalone-preset.js'],
  });

  await app.register(fastifyApiReference, {
    routePrefix: '/api/reference',
    configuration: { url: '/api/docs-json' },
  });

  const port = process.env.PORT || "3001";

    await app.listen({
      port: parseInt(port),
      host: '0.0.0.0'
    });

    console.log(`Application is running on port ${port}`);
    console.log('URL:', await app.getUrl());
    console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
