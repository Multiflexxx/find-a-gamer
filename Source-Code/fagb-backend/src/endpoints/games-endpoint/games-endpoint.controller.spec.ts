import { Test, TestingModule } from '@nestjs/testing';
import { GamesEndpointController } from './games-endpoint.controller';

describe('GamesEndpoint Controller', () => {
  let controller: GamesEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesEndpointController],
    }).compile();

    controller = module.get<GamesEndpointController>(GamesEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
