import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NamnamCustomerApiModule } from './namnam_customer_api.module';
import { ValidationPipe } from '@nestjs/common';
import fastifyApiReference from '@scalar/fastify-api-reference';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamCustomerApiModule,
    new FastifyAdapter()
  );
  app.setGlobalPrefix('api');

  app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  const config = new DocumentBuilder()
    .setTitle('NamNam Customer API')
    .setDescription('The API documentation for the NamNam Customer Application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.register(fastifyApiReference, {
    routePrefix: '/api/reference',
    configuration: { spec: { url: '/api/docs-json' } },
  });

  // Use Render's PORT environment variable
  const port = process.env.PORT || "3002";
  
  await app.listen({ 
    port: parseInt(port), 
    host: '0.0.0.0' 
  });
  
  console.log(`Application is running on port ${port}`);
  console.log('URL:', await app.getUrl());
}
bootstrap();