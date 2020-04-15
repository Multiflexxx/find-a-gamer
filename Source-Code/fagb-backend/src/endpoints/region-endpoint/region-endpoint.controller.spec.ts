import { Test, TestingModule } from '@nestjs/testing';
import { RegionEndpointController } from './region-endpoint.controller';
import { Region } from '../../data_objects/region';

describe('RegionEndpoint Controller', () => {
  let controller: RegionEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegionEndpointController],
    }).compile();

    controller = module.get<RegionEndpointController>(RegionEndpointController);
  });

  it('Should return a Regionresponse if successfull', async () => {
    const regionResponse = await controller.getAllRegionsEndpoint();

    expect(regionResponse[0]).toBeInstanceOf(Region);
  });
});
