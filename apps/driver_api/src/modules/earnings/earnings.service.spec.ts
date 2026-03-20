import { Test, TestingModule } from '@nestjs/testing';
import { EarningsService } from './earnings.service';
import { EarningsRepository } from './earnings.repository';

const makeEntry = (overrides: object = {}) => ({
  earning_id: 1,
  order_id: 42,
  driver_id: 1,
  base_fee: '3.50',
  distance_bonus: '0.50',
  peak_bonus: '1.00',
  tip: '0.00',
  total: '5.00',
  paid_out: false,
  created_at: new Date('2024-06-01T12:00:00.000Z'),
  ...overrides,
});

const mockEarningsRepository = {
  getEarnings: jest.fn(),
  getWeeklyBreakdown: jest.fn(),
};

describe('EarningsService', () => {
  let service: EarningsService;
  let repo: jest.Mocked<EarningsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EarningsService,
        { provide: EarningsRepository, useValue: mockEarningsRepository },
      ],
    }).compile();

    service = module.get(EarningsService);
    repo = module.get(EarningsRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getSummary', () => {
    it('returns aggregated totals for today', async () => {
      const entries = [makeEntry(), makeEntry({ earning_id: 2, order_id: 43, total: '7.00', base_fee: '5.00' })];
      repo.getEarnings.mockResolvedValueOnce(entries as any);

      const result = await service.getSummary(1, 'today');

      expect(repo.getEarnings).toHaveBeenCalledWith(1, expect.any(Date), expect.any(Date));
      expect(result.totalDeliveries).toBe(2);
      expect(result.totalEarned).toBeCloseTo(12.0);
      expect(result.baseFees).toBeCloseTo(8.5);
      expect(result.period).toBe('today');
    });

    it('returns zero totals when no earnings for period', async () => {
      repo.getEarnings.mockResolvedValueOnce([]);

      const result = await service.getSummary(1, 'week');

      expect(result.totalEarned).toBe(0);
      expect(result.totalDeliveries).toBe(0);
      expect(result.entries).toEqual([]);
      expect(result.period).toBe('week');
    });

    it('maps entries to response DTOs correctly', async () => {
      repo.getEarnings.mockResolvedValueOnce([makeEntry()] as any);

      const result = await service.getSummary(1, 'today');

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].earningId).toBe(1);
      expect(result.entries[0].orderId).toBe(42);
      expect(result.entries[0].baseFee).toBe(3.5);
      expect(result.entries[0].total).toBe(5.0);
      expect(result.entries[0].createdAt).toBe('2024-06-01T12:00:00.000Z');
    });

    it('uses month date range for period=month', async () => {
      repo.getEarnings.mockResolvedValueOnce([]);

      await service.getSummary(1, 'month');

      const [, fromDate] = repo.getEarnings.mock.calls[0];
      expect(fromDate.getDate()).toBe(1); // start of month
    });

    it('defaults to today when no period provided', async () => {
      repo.getEarnings.mockResolvedValueOnce([makeEntry()] as any);

      const result = await service.getSummary(1);

      expect(result.period).toBe('today');
    });
  });
});
