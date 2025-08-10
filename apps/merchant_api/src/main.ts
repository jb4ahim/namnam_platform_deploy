import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
app.enableCors({ origin: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  const port = process.env.PORT || "5634";
  
    await app.listen({ 
      port: parseInt(port), 
      host: '0.0.0.0' 
    });
    
    console.log(`Application is running on port ${port}`);
    console.log('URL:', await app.getUrl());
}
bootstrap();
