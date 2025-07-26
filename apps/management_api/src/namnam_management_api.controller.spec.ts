import { Test, TestingModule } from '@nestjs/testing';
import { NamnamManagementApiController } from './namnam_management_api.controller';
import { NamnamManagementApiService } from './namnam_management_api.service';

describe('NamnamManagementApiController', () => {
  let namnamManagementApiController: NamnamManagementApiController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NamnamManagementApiController],
      providers: [NamnamManagementApiService],
    }).compile();

    namnamManagementApiController = app.get<NamnamManagementApiController>(NamnamManagementApiController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(namnamManagementApiController.getHello()).toBe('Hello World!');
    });
  });
});
