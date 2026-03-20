import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@app/auth';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { DriverProfileResponseDto } from './dto/profile-response.dto';

const mockReq = { user: { userId: 1 } };

const mockProfile: DriverProfileResponseDto = {
  driverId: 1,
  name: 'Ahmad Hassan',
  countryCode: '+961',
  phoneNumber: '71234567',
  vehicleType: 'motorcycle',
  licensePlate: 'LB-12345',
  availabilityStatus: 'offline',
  averageRating: 4.8,
  totalDeliveries: 52,
  joinedAt: '2024-01-01T00:00:00.000Z',
};

describe('ProfileController', () => {
  let controller: ProfileController;
  let service: jest.Mocked<ProfileService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get(ProfileController);
    service = module.get(ProfileService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getProfile', () => {
    it('returns profile from service', async () => {
      service.getProfile.mockResolvedValueOnce(mockProfile);

      const result = await controller.getProfile(mockReq);

      expect(service.getProfile).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProfile);
    });

    it('propagates NotFoundException from service', async () => {
      service.getProfile.mockRejectedValueOnce(new NotFoundException('Driver not found'));

      await expect(controller.getProfile(mockReq)).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateProfile', () => {
    it('delegates update to service', async () => {
      const dto: UpdateProfileDto = { vehicleType: 'car', licensePlate: 'LB-99999' };
      service.updateProfile.mockResolvedValueOnce(undefined);

      await controller.updateProfile(mockReq, dto);

      expect(service.updateProfile).toHaveBeenCalledWith(1, dto);
    });
  });
});
