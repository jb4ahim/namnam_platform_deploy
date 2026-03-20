import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityService } from './availability.service';
import { AvailabilityRepository } from './availability.repository';
import { UpdateAvailabilityDto, UpdateLocationDto } from './dto/update-availability.dto';

const mockAvailabilityRepository = {
  getStatus: jest.fn(),
  setAvailability: jest.fn(),
  updateLocation: jest.fn(),
};

describe('AvailabilityService', () => {
  let service: AvailabilityService;
  let repo: jest.Mocked<AvailabilityRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AvailabilityService,
        { provide: AvailabilityRepository, useValue: mockAvailabilityRepository },
      ],
    }).compile();

    service = module.get(AvailabilityService);
    repo = module.get(AvailabilityRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getStatus', () => {
    it('returns mapped status and location', async () => {
      repo.getStatus.mockResolvedValueOnce({
        availability_status: 'online',
        last_latitude: '33.8938' as any,
        last_longitude: '35.5018' as any,
      });

      const result = await service.getStatus(1);

      expect(repo.getStatus).toHaveBeenCalledWith(1);
      expect(result.status).toBe('online');
      expect(result.lastLatitude).toBe(33.8938);
      expect(result.lastLongitude).toBe(35.5018);
    });

    it('returns offline with null coordinates when no profile', async () => {
      repo.getStatus.mockResolvedValueOnce(null);

      const result = await service.getStatus(1);

      expect(result.status).toBe('offline');
      expect(result.lastLatitude).toBeNull();
      expect(result.lastLongitude).toBeNull();
    });

    it('returns null coordinates when location not set', async () => {
      repo.getStatus.mockResolvedValueOnce({
        availability_status: 'busy',
        last_latitude: null,
        last_longitude: null,
      });

      const result = await service.getStatus(1);

      expect(result.status).toBe('busy');
      expect(result.lastLatitude).toBeNull();
      expect(result.lastLongitude).toBeNull();
    });
  });

  describe('setAvailability', () => {
    it('delegates to repository with correct status', async () => {
      const dto: UpdateAvailabilityDto = { status: 'online' };
      repo.setAvailability.mockResolvedValueOnce(undefined);

      await service.setAvailability(1, dto);

      expect(repo.setAvailability).toHaveBeenCalledWith(1, 'online');
    });

    it('sets offline status', async () => {
      const dto: UpdateAvailabilityDto = { status: 'offline', offlineReason: 'end_shift' };
      repo.setAvailability.mockResolvedValueOnce(undefined);

      await service.setAvailability(1, dto);

      expect(repo.setAvailability).toHaveBeenCalledWith(1, 'offline');
    });
  });

  describe('updateLocation', () => {
    it('delegates location update to repository', async () => {
      const dto: UpdateLocationDto = { latitude: 33.8938, longitude: 35.5018 };
      repo.updateLocation.mockResolvedValueOnce(undefined);

      await service.updateLocation(1, dto);

      expect(repo.updateLocation).toHaveBeenCalledWith(1, 33.8938, 35.5018);
    });
  });
});
