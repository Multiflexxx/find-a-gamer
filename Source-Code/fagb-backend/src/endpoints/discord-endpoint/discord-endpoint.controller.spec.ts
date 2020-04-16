import { Test, TestingModule } from '@nestjs/testing';
import { DiscordEndpointController } from './discord-endpoint.controller';

describe('DiscordEndpoint Controller', () => {
  let controller: DiscordEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordEndpointController],
    }).compile();

    controller = module.get<DiscordEndpointController>(DiscordEndpointController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
