import { Test, TestingModule } from '@nestjs/testing';
import { ProfileUpdateEndpointController } from './profileupdateendpoint.controller';

describe('Profileupdateendpoint Controller', () => {
  let controller: ProfileUpdateEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileUpdateEndpointController],
    }).compile();

    controller = module.get<ProfileUpdateEndpointController>(ProfileUpdateEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
