import { Controller, Get, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GameFactory } from '../../factory/gamefactory';
import { Game } from '../../data_objects/game';
import { MatchFactory } from '../../factory/matchfactory';
import { GameResponse } from 'src/data_objects/gameresponse';

@Injectable()
@Controller('gamesendpoint')
export class GamesEndpointController {

    @Get()
    public async getAllGamesEndpoint(): Promise<GameResponse> {

        let games;
        await MatchFactory.getMatchMakingCountForGames().then(function(callbackValue) {
            games = callbackValue;
        }, function(callbackValue) {
            console.error("GamesEndpointController getAllGamesEndpoint(): ")
        });

        if(!games) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to get games"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return games;
    }
}
