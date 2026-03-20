import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const isRender = (process.env.DB_HOST || '').includes('render.com')
      || (process.env.DATABASE_URL || '').includes('render.com');

    const ssl = isRender || process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : false;

    super({
      adapter: new PrismaPg({
        connectionString: process.env.DATABASE_URL,
        ssl,
        max: 5,
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
