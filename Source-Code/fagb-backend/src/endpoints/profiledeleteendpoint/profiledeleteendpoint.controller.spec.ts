import { Test, TestingModule } from '@nestjs/testing';
import { ProfileDeleteEndpointController } from './profiledeleteendpoint.controller';

describe('Profiledeleteendpoint Controller', () => {
  let profileDeleteEndpointController: ProfileDeleteEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileDeleteEndpointController],
    }).compile();

    profileDeleteEndpointController = module.get<ProfileDeleteEndpointController>(ProfileDeleteEndpointController);
  });

  it('should be defined', () => {

  });
});