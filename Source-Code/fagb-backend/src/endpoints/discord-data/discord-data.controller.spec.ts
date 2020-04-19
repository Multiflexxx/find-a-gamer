import { Test, TestingModule } from '@nestjs/testing';
import { DiscordDataController } from './discord-data.controller';

describe('DiscordData Controller', () => {
  let controller: DiscordDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscordDataController],
    }).compile();

    controller = module.get<DiscordDataController>(DiscordDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
