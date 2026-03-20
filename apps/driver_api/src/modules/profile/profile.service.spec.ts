import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';

const mockProfileRepository = {
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  updateDocumentKey: jest.fn(),
};

const mockDbUser = {
  user_id: 1,
  name: 'Ahmad Hassan',
  country_code: '+961',
  phone_number: '71234567',
  created_at: new Date('2024-01-01'),
  driver_profiles: {
    vehicle_type: 'motorcycle',
    license_plate: 'LB-12345',
    profile_photo_key: null,
    license_key: null,
    insurance_key: null,
    availability_status: 'offline',
  },
  driver_performance: [{ average_rating: '4.80', orders_completed: 52 }],
};

describe('ProfileService', () => {
  let service: ProfileService;
  let repo: jest.Mocked<ProfileRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: ProfileRepository, useValue: mockProfileRepository },
      ],
    }).compile();

    service = module.get(ProfileService);
    repo = module.get(ProfileRepository);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getProfile', () => {
    it('returns mapped profile data', async () => {
      repo.getProfile.mockResolvedValueOnce(mockDbUser as any);

      const result = await service.getProfile(1);

      expect(repo.getProfile).toHaveBeenCalledWith(1);
      expect(result.driverId).toBe(1);
      expect(result.name).toBe('Ahmad Hassan');
      expect(result.vehicleType).toBe('motorcycle');
      expect(result.availabilityStatus).toBe('offline');
      expect(result.averageRating).toBe(4.8);
      expect(result.totalDeliveries).toBe(52);
      expect(result.joinedAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('handles driver with no performance records', async () => {
      const userWithoutPerf = { ...mockDbUser, driver_performance: [] };
      repo.getProfile.mockResolvedValueOnce(userWithoutPerf as any);

      const result = await service.getProfile(1);

      expect(result.averageRating).toBeUndefined();
      expect(result.totalDeliveries).toBeUndefined();
    });

    it('handles driver with no profile record', async () => {
      const userWithoutProfile = { ...mockDbUser, driver_profiles: null };
      repo.getProfile.mockResolvedValueOnce(userWithoutProfile as any);

      const result = await service.getProfile(1);

      expect(result.vehicleType).toBeUndefined();
      expect(result.availabilityStatus).toBe('offline');
    });

    it('throws NotFoundException when driver not found', async () => {
      repo.getProfile.mockResolvedValueOnce(null);

      await expect(service.getProfile(999)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('delegates update to repository', async () => {
      const dto: UpdateProfileDto = { vehicleType: 'car', fcmToken: 'fcm-abc' };
      repo.updateProfile.mockResolvedValueOnce(undefined);

      await service.updateProfile(1, dto);

      expect(repo.updateProfile).toHaveBeenCalledWith(1, dto);
    });
  });
});
