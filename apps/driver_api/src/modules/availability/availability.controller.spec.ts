import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@app/auth';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { UpdateAvailabilityDto, UpdateLocationDto } from './dto/update-availability.dto';

const mockReq = { user: { userId: 1 } };

describe('AvailabilityController', () => {
  let controller: AvailabilityController;
  let service: jest.Mocked<AvailabilityService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityController],
      providers: [
        {
          provide: AvailabilityService,
          useValue: {
            getStatus: jest.fn(),
            setAvailability: jest.fn(),
            updateLocation: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(AvailabilityController);
    service = module.get(AvailabilityService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getStatus', () => {
    it('returns current driver status', async () => {
      const expected = { status: 'online' as any, lastLatitude: 33.89, lastLongitude: 35.5 };
      service.getStatus.mockResolvedValueOnce(expected);

      const result = await controller.getStatus(mockReq);

      expect(service.getStatus).toHaveBeenCalledWith(1);
      expect(result).toEqual(expected);
    });

    it('returns offline status when no profile exists', async () => {
      service.getStatus.mockResolvedValueOnce({ status: 'offline' as any, lastLatitude: null, lastLongitude: null });

      const result = await controller.getStatus(mockReq);

      expect(result.status).toBe('offline');
    });
  });

  describe('setAvailability', () => {
    it('sets driver to online', async () => {
      const dto: UpdateAvailabilityDto = { status: 'online' };
      service.setAvailability.mockResolvedValueOnce(undefined);

      await controller.setAvailability(mockReq, dto);

      expect(service.setAvailability).toHaveBeenCalledWith(1, dto);
    });

    it('sets driver to offline with reason', async () => {
      const dto: UpdateAvailabilityDto = { status: 'offline', offlineReason: 'taking_a_break' };
      service.setAvailability.mockResolvedValueOnce(undefined);

      await controller.setAvailability(mockReq, dto);

      expect(service.setAvailability).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('updateLocation', () => {
    it('updates driver GPS coordinates', async () => {
      const dto: UpdateLocationDto = { latitude: 33.8938, longitude: 35.5018 };
      service.updateLocation.mockResolvedValueOnce(undefined);

      await controller.updateLocation(mockReq, dto);

      expect(service.updateLocation).toHaveBeenCalledWith(1, dto);
    });
  });
});
