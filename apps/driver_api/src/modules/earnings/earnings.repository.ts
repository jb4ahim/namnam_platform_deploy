import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/database';

@Injectable()
export class EarningsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getEarnings(driverId: number, from: Date, to: Date) {
    return this.prisma.driver_earnings.findMany({
      where: {
        driver_id: driverId,
        created_at: { gte: from, lte: to },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getWeeklyBreakdown(driverId: number) {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    return this.prisma.driver_earnings.groupBy({
      by: ['created_at'],
      where: {
        driver_id: driverId,
        created_at: { gte: weekStart },
      },
      _sum: { total: true },
      orderBy: { created_at: 'asc' },
    });
  }
}
