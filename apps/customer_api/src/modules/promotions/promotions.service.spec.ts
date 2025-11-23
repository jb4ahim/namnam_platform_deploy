import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PromotionsRepository } from './promotions.repository';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let repo: jest.Mocked<PromotionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        {
          provide: PromotionsRepository,
          useValue: {
            getPromotions: jest.fn(),
            getPromotionById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(PromotionsService);
    repo = module.get(PromotionsRepository);
  });

  it('forwards filters when fetching promotions', async () => {
    const mockResult = [{ id: 1 }];
    repo.getPromotions.mockResolvedValueOnce(mockResult);

    const result = await service.getPromotions(10, true, 5);

    expect(repo.getPromotions).toHaveBeenCalledWith(10, true, 5);
    expect(result).toEqual(mockResult);
  });

  it('fetches promotion by id', async () => {
    const promo = { id: 2, title: 'Deal' };
    repo.getPromotionById.mockResolvedValueOnce(promo);

    const result = await service.getPromotionById(2);

    expect(repo.getPromotionById).toHaveBeenCalledWith(2);
    expect(result).toEqual(promo);
  });
});
