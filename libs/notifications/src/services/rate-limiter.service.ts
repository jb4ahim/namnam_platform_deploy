import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { NotificationType } from '../dto/notification.dto';

@Injectable()
export class RateLimiterService {
  constructor(@InjectRedis() private redis: Redis) {}

  async checkRateLimit(
    recipient: string,
    type: NotificationType,
    maxAttempts = 10,
    windowMs = 60000
  ): Promise<{ allowed: boolean; remaining: number }> {
    const key = `rate_limit:${type}:${recipient}`;
    const window = Math.floor(Date.now() / windowMs);
    const windowKey = `${key}:${window}`;

    const current = await this.redis.get(windowKey);
    const count = current ? parseInt(current) : 0;

    if (count >= maxAttempts) {
      return { allowed: false, remaining: 0 };
    }

    await this.redis.multi()
      .incr(windowKey)
      .expire(windowKey, Math.ceil(windowMs / 1000))
      .exec();

    return { allowed: true, remaining: maxAttempts - count - 1 };
  }
}
