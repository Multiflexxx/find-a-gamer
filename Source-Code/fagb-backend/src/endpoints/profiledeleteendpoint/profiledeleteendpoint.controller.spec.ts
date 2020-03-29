import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDeleteEndpointController } from './profiledeleteendpoint.controller';

describe('Profiledeleteendpoint Controller', () => {
  let controller: ProfileDeleteEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileDeleteEndpointController],
    }).compile();

    controller = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});