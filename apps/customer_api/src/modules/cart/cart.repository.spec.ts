import { Test, TestingModule } from '@nestjs/testing';
import { CartRepository } from './cart.repository';
import { DatabaseUtils, PostgresService } from '@app/database';

jest.mock('@app/database');

describe('CartRepository', () => {
  let repository: CartRepository;
  let postgresService: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartRepository,
        {
          provide: PostgresService,
          useValue: {},
        },
      ],
    }).compile();

    repository = module.get<CartRepository>(CartRepository);
    postgresService = module.get<PostgresService>(PostgresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCart', () => {
    it('should call select_cart_items function', async () => {
      const userId = 1;
      const mockResult = {
        cart_id: 1,
        items: [],
      };

      (DatabaseUtils.callFunction as jest.Mock).mockResolvedValue(mockResult);

      const result = await repository.getCart(userId);

      expect(DatabaseUtils.callFunction).toHaveBeenCalledWith(
        postgresService,
        'select_cart_items',
        [userId],
        false
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('addItem', () => {
    it('should call add_to_cart procedure', async () => {
      const userId = 1;
      const dto = { product_id: 1, quantity: 2 };

      await repository.addItem(userId, dto);

      expect(DatabaseUtils.callProcedure).toHaveBeenCalledWith(
        postgresService,
        'add_to_cart',
        [userId, dto.product_id, dto.quantity]
      );
    });
  });

  describe('removeItem', () => {
    it('should call remove_from_cart procedure', async () => {
      const userId = 1;
      const itemId = 1;

      await repository.removeItem(userId, itemId);

      expect(DatabaseUtils.callProcedure).toHaveBeenCalledWith(
        postgresService,
        'remove_from_cart',
        [userId, itemId]
      );
    });
  });
});
