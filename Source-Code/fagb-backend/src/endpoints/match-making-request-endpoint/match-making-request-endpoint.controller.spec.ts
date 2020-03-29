import { Test, TestingModule } from '@nestjs/testing';
import { MatchMakingRequestEndpointController } from './match-making-request-endpoint.controller';

describe('MatchMakingRequestEndpoint Controller', () => {
  let controller: MatchMakingRequestEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchMakingRequestEndpointController],
    }).compile();

    controller = module.get<MatchMakingRequestEndpointController>(MatchMakingRequestEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
