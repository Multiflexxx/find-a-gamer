import { Test, TestingModule } from '@nestjs/testing';
import { GamesEndpointController } from './games-endpoint.controller';
import { GameResponse } from '../../data_objects/gameresponse';

describe('GamesEndpoint Controller', () => {
  let controller: GamesEndpointController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesEndpointController],
    }).compile();

    controller = module.get<GamesEndpointController>(GamesEndpointController);
  });

  it('Should return a Gameresponse if successfull', async () => {
    const gamesGameResponse = await controller.getAllGamesEndpoint();

    expect(gamesGameResponse[0]).toBeInstanceOf(GameResponse);
  });
});
