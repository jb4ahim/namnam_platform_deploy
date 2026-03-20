import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@app/auth/jwt.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';

const mockTokens = { accessToken: 'access', refreshToken: 'refresh', expiresIn: 900 };

const mockAuthRepository = {
  saveOtpPhone: jest.fn(),
  verifyOtp: jest.fn(),
  findDriverByPhone: jest.fn(),
  createDriverWithPhone: jest.fn(),
  createDriverProfile: jest.fn(),
};

const mockJwtService = {
  generateTokenPair: jest.fn().mockReturnValue(mockTokens),
  verifyRefreshToken: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let repo: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepository, useValue: mockAuthRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get(AuthService);
    repo = module.get(AuthRepository);
    jwtService = module.get(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('sendOtp', () => {
    it('saves OTP via repository', async () => {
      const dto: SendOtpDto = { countryCode: '+961', phoneNumber: '71234567' };
      await service.sendOtp(dto);
      expect(repo.saveOtpPhone).toHaveBeenCalledWith('+961', '71234567', '123456');
    });
  });

  describe('verifyOtp', () => {
    const dto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '71234567', code: '123456' };

    it('throws UnauthorizedException for wrong OTP code', async () => {
      const badDto: VerifyOtpDto = { ...dto, code: 'wrong1' };
      await expect(service.verifyOtp(badDto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('returns tokens when driver already registered', async () => {
      repo.verifyOtp.mockResolvedValueOnce(true);
      repo.findDriverByPhone.mockResolvedValueOnce(5);

      const result = await service.verifyOtp(dto);

      expect(result).toMatchObject({ isRegistered: true, accessToken: 'access' });
      expect(jwtService.generateTokenPair).toHaveBeenCalledWith({ userId: 5 });
    });

    it('returns verifyToken when driver not yet registered', async () => {
      repo.verifyOtp.mockResolvedValueOnce(false);
      repo.findDriverByPhone.mockResolvedValueOnce(null);

      const result = await service.verifyOtp(dto);

      expect(result).toMatchObject({ isRegistered: false });
      expect(result).toHaveProperty('verifyToken');
      expect(result).toHaveProperty('expiresAt');
    });
  });

  describe('registerDriver', () => {
    it('throws UnauthorizedException for unknown verifyToken', async () => {
      const dto: RegisterDriverDto = { firstName: 'Ahmad', lastName: 'Hassan', verifyToken: 'bad-token' };
      await expect(service.registerDriver(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('creates driver and profile, returns tokens for valid token', async () => {
      // First, obtain a valid token via verifyOtp
      const otpDto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '71234567', code: '123456' };
      repo.verifyOtp.mockResolvedValueOnce(false);
      repo.findDriverByPhone.mockResolvedValueOnce(null);
      const otpResult = await service.verifyOtp(otpDto) as any;

      repo.createDriverWithPhone.mockResolvedValueOnce(10);
      repo.createDriverProfile.mockResolvedValueOnce({} as any);

      const dto: RegisterDriverDto = {
        firstName: 'Ahmad',
        lastName: 'Hassan',
        vehicleType: 'motorcycle',
        licensePlate: 'LB-12345',
        verifyToken: otpResult.verifyToken,
      };

      const result = await service.registerDriver(dto);

      expect(repo.createDriverWithPhone).toHaveBeenCalledWith('+961', '71234567', 'Ahmad', 'Hassan');
      expect(repo.createDriverProfile).toHaveBeenCalledWith(10, 'motorcycle', 'LB-12345');
      expect(jwtService.generateTokenPair).toHaveBeenCalledWith({ userId: 10 });
      expect(result).toMatchObject({ accessToken: 'access' });
    });

    it('throws UnauthorizedException for expired verifyToken', async () => {
      // Inject an already-expired token manually
      const expiredToken = 'expired-token';
      (service as any).registrationTokens.set(expiredToken, {
        countryCode: '+961',
        phoneNumber: '71234567',
        expiresAt: new Date(Date.now() - 1000), // expired 1 second ago
      });

      const dto: RegisterDriverDto = { firstName: 'A', lastName: 'B', verifyToken: expiredToken };
      await expect(service.registerDriver(dto)).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('returns new tokens for valid refresh token', async () => {
      jwtService.verifyRefreshToken.mockReturnValueOnce({ userId: 5 } as any);

      const result = await service.refreshToken('valid-refresh');

      expect(jwtService.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh');
      expect(jwtService.generateTokenPair).toHaveBeenCalledWith({ userId: 5 });
      expect(result).toMatchObject({ accessToken: 'access' });
    });

    it('throws UnauthorizedException for invalid refresh token', async () => {
      jwtService.verifyRefreshToken.mockReturnValueOnce(null);
      await expect(service.refreshToken('bad-token')).rejects.toBeInstanceOf(UnauthorizedException);
    });
  });
});
