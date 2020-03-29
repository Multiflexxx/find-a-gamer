import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEndpointController } from './languages-endpoint.controller';

describe('LanguagesEndpoint Controller', () => {
  let controller: LanguagesEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguagesEndpointController],
    }).compile();

    controller = module.get<LanguagesEndpointController>(LanguagesEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
