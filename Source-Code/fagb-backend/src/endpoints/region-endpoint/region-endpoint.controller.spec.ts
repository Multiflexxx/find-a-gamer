import { Test, TestingModule } from '@nestjs/testing';
import { RegionEndpointController } from './region-endpoint.controller';

describe('RegionEndpoint Controller', () => {
  let controller: RegionEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionEndpointController],
    }).compile();

    controller = module.get<RegionEndpointController>(RegionEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
