import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

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
            registerWithPhone: jest.fn(),
            refreshToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
  });

  it('delegates OTP sending to the service', async () => {
    const dto: SendOtpDto = { countryCode: '+961', phoneNumber: '70000000' };

    await controller.sendOtp(dto);

    expect(service.sendOtp).toHaveBeenCalledWith(dto);
  });

  it('returns verifyOtp result', async () => {
    const dto: VerifyOtpDto = { countryCode: '+961', phoneNumber: '70000000', code: '123456' };
    const expected = { isRegistered: true, accessToken: 'a', refreshToken: 'b' };
    service.verifyOtp.mockResolvedValueOnce(expected);

    const result = await controller.verifyOtp(dto);

    expect(service.verifyOtp).toHaveBeenCalledWith(dto);
    expect(result).toEqual(expected);
  });

  it('registers a new user with verify token', async () => {
    const dto: RegisterUserDto = {
      firstName: 'Jane',
      lastName: 'Doe',
      verifyToken: 'token',
      email: 'jane@example.com',
      gender: 'female',
      birthday: '1990-01-01',
      defaultCurrency: 'USD',
      status: 'active',
    };
    const tokens = { accessToken: 'access', refreshToken: 'refresh' };
    service.registerWithPhone.mockResolvedValueOnce(tokens);

    const result = await controller.registerUser(dto);

    expect(service.registerWithPhone).toHaveBeenCalledWith(dto);
    expect(result).toEqual(tokens);
  });

  it('refreshes tokens', async () => {
    const tokens = { accessToken: 'new-access', refreshToken: 'new-refresh' };
    service.refreshToken.mockResolvedValueOnce(tokens);

    const result = await controller.refreshToken({ token: 'old-refresh' });

    expect(service.refreshToken).toHaveBeenCalledWith('old-refresh');
    expect(result).toEqual(tokens);
  });
});
