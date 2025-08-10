// cors.options.ts
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const CorsOptions: CorsOptions = {
  origin: ['http://localhost:3000'], // Add other origins as needed (production/staging)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // set to true if you need cookies/auth headers
  maxAge: 86400, // cache the response for 1 day
};
