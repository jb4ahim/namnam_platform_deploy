import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify';
import { NamnamCustomerApiModule } from './namnam_customer_api.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    NamnamCustomerApiModule,
    new FastifyAdapter()
  );
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));

  // Use Render's PORT environment variable
  const port = process.env.PORT || "2352";
  
  await app.listen({ 
    port: parseInt(port), 
    host: '0.0.0.0' 
  });
  
  console.log(`Application is running on port ${port}`);
  console.log('URL:', await app.getUrl());
}
bootstrap();