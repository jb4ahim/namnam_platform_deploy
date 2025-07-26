import { Test, TestingModule } from '@nestjs/testing';
import { NamnamCustomerApiController } from './namnam_customer_api.controller';
import { NamnamCustomerApiService } from './namnam_customer_api.service';

describe('NamnamCustomerApiController', () => {
  let namnamCustomerApiController: NamnamCustomerApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NamnamCustomerApiController],
      providers: [NamnamCustomerApiService],
    }).compile();

    namnamCustomerApiController = app.get<NamnamCustomerApiController>(NamnamCustomerApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(namnamCustomerApiController.getHello()).toBe('Hello World!');
    });
  });
});
