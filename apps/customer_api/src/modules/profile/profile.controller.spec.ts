import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

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
            getPreferences: jest.fn(),
            updatePreferences: jest.fn(),
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(ProfileController);
    service = module.get(ProfileService);
  });

  it('gets profile', async () => {
    service.getProfile.mockResolvedValueOnce({ id: 1 });

    const result = await controller.getProfile(1);

    expect(service.getProfile).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('updates profile', async () => {
    const dto: UpdateProfileDto = { name: 'Jane' };
    service.updateProfile.mockResolvedValueOnce({ success: true });

    const result = await controller.updateProfile(2, dto);

    expect(service.updateProfile).toHaveBeenCalledWith(2, dto);
    expect(result).toEqual({ success: true });
  });

  it('gets preferences', async () => {
    service.getPreferences.mockResolvedValueOnce({ language: 'en' });

    const result = await controller.getPreferences(4);

    expect(service.getPreferences).toHaveBeenCalledWith(4);
    expect(result).toEqual({ language: 'en' });
  });

  it('updates preferences', async () => {
    const dto: UpdatePreferencesDto = { language: 'en' };
    service.updatePreferences.mockResolvedValueOnce({ success: true });

    const result = await controller.updatePreferences(5, dto);

    expect(service.updatePreferences).toHaveBeenCalledWith(5, dto);
    expect(result).toEqual({ success: true });
  });

  it('deletes account', async () => {
    service.deleteAccount.mockResolvedValueOnce({ success: true });

    const result = await controller.deleteAccount(6);

    expect(service.deleteAccount).toHaveBeenCalledWith(6);
    expect(result).toEqual({ success: true });
  });
});
