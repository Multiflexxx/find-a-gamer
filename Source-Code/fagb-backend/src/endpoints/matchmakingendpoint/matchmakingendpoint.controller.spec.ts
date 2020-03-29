import { Test, TestingModule } from '@nestjs/testing';
import { MatchMakingEndpointController } from './matchmakingendpoint.controller';

describe('Registration Controller', () => {
  let controller: MatchMakingEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchMakingEndpointController],
    }).compile();

    controller = module.get<MatchMakingEndpointController>(MatchMakingEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
