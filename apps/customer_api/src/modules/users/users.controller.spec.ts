import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getCustomerInfos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('returns user info when found', async () => {
    service.getCustomerInfos.mockResolvedValueOnce({ id: 1 });

    const result = await controller.getUserInfos({}, 1);

    expect(service.getCustomerInfos).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it('throws NotFound when user missing', async () => {
    service.getCustomerInfos.mockResolvedValueOnce(null as any);

    await expect(controller.getUserInfos({}, 2)).rejects.toBeInstanceOf(NotFoundException);
  });
});
