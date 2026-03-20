import { Injectable } from '@nestjs/common';
import { EarningsRepository } from './earnings.repository';
import { EarningsSummaryDto } from './dto/earnings-response.dto';

type Period = 'today' | 'week' | 'month';

@Injectable()
export class EarningsService {
  constructor(private readonly repo: EarningsRepository) {}

  async getSummary(driverId: number, period: Period = 'today'): Promise<EarningsSummaryDto> {
    const { from, to } = this.getDateRange(period);
    const entries = await this.repo.getEarnings(driverId, from, to);

    const totals = entries.reduce(
      (acc, e) => ({
        totalEarned: acc.totalEarned + Number(e.total),
        baseFees: acc.baseFees + Number(e.base_fee),
        distanceBonuses: acc.distanceBonuses + Number(e.distance_bonus),
        peakBonuses: acc.peakBonuses + Number(e.peak_bonus),
        tips: acc.tips + Number(e.tip),
      }),
      { totalEarned: 0, baseFees: 0, distanceBonuses: 0, peakBonuses: 0, tips: 0 },
    );

    return {
      ...totals,
      totalDeliveries: entries.length,
      period,
      entries: entries.map(e => ({
        earningId: e.earning_id,
        orderId: e.order_id,
        baseFee: Number(e.base_fee),
        distanceBonus: Number(e.distance_bonus),
        peakBonus: Number(e.peak_bonus),
        tip: Number(e.tip),
        total: Number(e.total),
        createdAt: e.created_at?.toISOString() ?? '',
      })),
    };
  }

  private getDateRange(period: Period): { from: Date; to: Date } {
    const now = new Date();
    const to = new Date(now);
    to.setHours(23, 59, 59, 999);
    const from = new Date(now);

    if (period === 'today') {
      from.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
      from.setDate(now.getDate() - now.getDay());
      from.setHours(0, 0, 0, 0);
    } else {
      from.setDate(1);
      from.setHours(0, 0, 0, 0);
    }

    return { from, to };
  }
}
