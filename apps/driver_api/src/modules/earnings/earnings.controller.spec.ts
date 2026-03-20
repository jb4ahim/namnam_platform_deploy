import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@app/auth';
import { EarningsController } from './earnings.controller';
import { EarningsService } from './earnings.service';
import { EarningsSummaryDto } from './dto/earnings-response.dto';

const mockReq = { user: { userId: 1 } };

const mockSummary: EarningsSummaryDto = {
  totalEarned: 55.5,
  baseFees: 40.0,
  distanceBonuses: 5.0,
  peakBonuses: 7.5,
  tips: 3.0,
  totalDeliveries: 12,
  period: 'today',
  entries: [],
};

describe('EarningsController', () => {
  let controller: EarningsController;
  let service: jest.Mocked<EarningsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EarningsController],
      providers: [
        {
          provide: EarningsService,
          useValue: { getSummary: jest.fn() },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(EarningsController);
    service = module.get(EarningsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('returns today earnings by default', async () => {
    service.getSummary.mockResolvedValueOnce(mockSummary);

    const result = await controller.getSummary(mockReq, undefined);

    expect(service.getSummary).toHaveBeenCalledWith(1, 'today');
    expect(result).toEqual(mockSummary);
  });

  it('returns weekly earnings when period=week', async () => {
    const weeklySummary = { ...mockSummary, period: 'week', totalDeliveries: 48 };
    service.getSummary.mockResolvedValueOnce(weeklySummary);

    const result = await controller.getSummary(mockReq, 'week');

    expect(service.getSummary).toHaveBeenCalledWith(1, 'week');
    expect(result.totalDeliveries).toBe(48);
  });

  it('returns monthly earnings when period=month', async () => {
    service.getSummary.mockResolvedValueOnce({ ...mockSummary, period: 'month' });

    await controller.getSummary(mockReq, 'month');

    expect(service.getSummary).toHaveBeenCalledWith(1, 'month');
  });

  it('falls back to today for invalid period value', async () => {
    service.getSummary.mockResolvedValueOnce(mockSummary);

    await controller.getSummary(mockReq, 'invalid_period');

    expect(service.getSummary).toHaveBeenCalledWith(1, 'today');
  });
});
