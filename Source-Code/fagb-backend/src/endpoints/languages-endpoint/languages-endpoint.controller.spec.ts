import { Test, TestingModule } from '@nestjs/testing';
import { LanguagesEndpointController } from './languages-endpoint.controller';
import { Language } from '../../data_objects/language';
import { isNumber } from 'util';

describe('LanguagesEndpoint Controller', () => {
  let controller: LanguagesEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguagesEndpointController],
    }).compile();

    controller = module.get<LanguagesEndpointController>(LanguagesEndpointController);
  });

  it("Should return a Language ID if successfull", async () => {
    const languages = await controller.getAllLanguagesEndpoint();
    
    expect(languages[0].language_id).toBeGreaterThanOrEqual(1);
  });

  afterAll( () => {
    jest.resetAllMocks();
  })
});