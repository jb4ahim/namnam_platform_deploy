import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            sendOtp: jest.fn(),
            verifyOtp: jest.fn(),
            registerDriver: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('delegates OTP sending to the service', async () => {
    const dto: SendOtpDto = { countryCode: '+961', phoneNumber: '71234567' };
    await controller.sendOtp(dto);
    expect(service.sendOtp).toHaveBeenCalledWith(dto);
  });

  it('returns isRegistered:true with tokens when driver exists', async () => {
    const dto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '71234567', code: '123456' };
    const expected = { isRegistered: true, accessToken: 'access', refreshToken: 'refresh', expiresIn: 900 };
    service.verifyOtp.mockResolvedValueOnce(expected);

    const result = await controller.verifyOtp(dto);

    expect(service.verifyOtp).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('returns isRegistered:false with verifyToken when driver does not exist', async () => {
    const dto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '71234567', code: '123456' };
    const expected = { isRegistered: false, verifyToken: 'some-uuid', expiresAt: '2024-01-01T00:15:00.000Z' };
    service.verifyOtp.mockResolvedValueOnce(expected);

    const result = await controller.verifyOtp(dto);

    expect(result).toEqual(expected);
  });

  it('registers a new driver and returns tokens', async () => {
    const dto: RegisterDriverDto = {
      firstName: 'Ahmad',
      lastName: 'Hassan',
      vehicleType: 'motorcycle',
      licensePlate: 'LB-12345',
      verifyToken: 'some-uuid',
    };
    const tokens = { accessToken: 'access', refreshToken: 'refresh', expiresIn: 900 };
    service.registerDriver.mockResolvedValueOnce(tokens);

    const result = await controller.register(dto);

    expect(service.registerDriver).toHaveBeenCalledWith(dto);
    expect(result).toEqual(tokens);
  });

  it('refreshes access token', async () => {
    const tokens = { accessToken: 'new-access', refreshToken: 'new-refresh', expiresIn: 900 };
    service.refreshToken.mockResolvedValueOnce(tokens);

    const result = await controller.refreshToken({ token: 'old-refresh' });

    expect(service.refreshToken).toHaveBeenCalledWith('old-refresh');
    expect(result).toEqual(tokens);
  });

  it('throws when verifyOtp service throws', async () => {
    const dto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '71234567', code: 'wrong' };
    service.verifyOtp.mockRejectedValueOnce(new UnauthorizedException('Invalid or expired code'));

    await expect(controller.verifyOtp(dto)).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
