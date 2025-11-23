import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './app-config.service';
import { AppConfigRepository } from './app-config.repository';

describe('AppConfigService', () => {
  let service: AppConfigService;
  let repo: jest.Mocked<AppConfigRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: AppConfigRepository,
          useValue: {
            getHomeConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
    repo = module.get(AppConfigRepository);
  });

  it('passes zone id through to the repository', async () => {
    repo.getHomeConfig.mockResolvedValueOnce({ layout: [] });

    const result = await service.getHomeConfig(5);

    expect(repo.getHomeConfig).toHaveBeenCalledWith(5);
    expect(result).toEqual({ layout: [] });
  });

  it('allows zone id to be omitted', async () => {
    repo.getHomeConfig.mockResolvedValueOnce(null);

    const result = await service.getHomeConfig();

    expect(repo.getHomeConfig).toHaveBeenCalledWith(undefined);
    expect(result).toBeNull();
  });
});
