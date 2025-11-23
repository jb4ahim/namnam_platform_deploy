import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { ProfileRepository } from './profile.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

describe('ProfileService', () => {
  let service: ProfileService;
  let repo: jest.Mocked<ProfileRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: ProfileRepository,
          useValue: {
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
            changePassword: jest.fn(),
            getPreferences: jest.fn(),
            updatePreferences: jest.fn(),
            deleteAccount: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ProfileService);
    repo = module.get(ProfileRepository);
  });

  it('fetches profile', async () => {
    const profile = { id: 1, first_name: 'Jane' };
    repo.getProfile.mockResolvedValueOnce(profile);

    const result = await service.getProfile(1);

    expect(repo.getProfile).toHaveBeenCalledWith(1);
    expect(result).toEqual(profile);
  });

  it('updates profile', async () => {
    const dto: UpdateProfileDto = { first_name: 'Jane', last_name: 'Doe' };
    repo.updateProfile.mockResolvedValueOnce({ success: true });

    const result = await service.updateProfile(2, dto);

    expect(repo.updateProfile).toHaveBeenCalledWith(2, dto);
    expect(result).toEqual({ success: true });
  });

  it('changes password', async () => {
    const dto: ChangePasswordDto = { current_password: 'old', new_password: 'new' };
    repo.changePassword.mockResolvedValueOnce({ success: true });

    const result = await service.changePassword(3, dto);

    expect(repo.changePassword).toHaveBeenCalledWith(3, dto);
    expect(result).toEqual({ success: true });
  });

  it('gets preferences', async () => {
    const prefs = { language: 'en' };
    repo.getPreferences.mockResolvedValueOnce(prefs);

    const result = await service.getPreferences(4);

    expect(repo.getPreferences).toHaveBeenCalledWith(4);
    expect(result).toEqual(prefs);
  });

  it('updates preferences', async () => {
    const dto: UpdatePreferencesDto = { language: 'en', notifications_enabled: true };
    repo.updatePreferences.mockResolvedValueOnce({ success: true });

    const result = await service.updatePreferences(5, dto);

    expect(repo.updatePreferences).toHaveBeenCalledWith(5, dto);
    expect(result).toEqual({ success: true });
  });

  it('deletes account', async () => {
    repo.deleteAccount.mockResolvedValueOnce({ success: true });

    const result = await service.deleteAccount(6);

    expect(repo.deleteAccount).toHaveBeenCalledWith(6);
    expect(result).toEqual({ success: true });
  });
});
