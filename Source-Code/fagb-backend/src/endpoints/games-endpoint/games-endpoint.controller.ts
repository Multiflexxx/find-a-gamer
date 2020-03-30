import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { GameFactory } from 'src/factory/gamefactory';
import { Game } from 'src/data_objects/game';
import { MatchFactory } from 'src/factory/matchfactory';

@Controller('gamesendpoint')
export class GamesEndpointController {

    @Get()
    public async getAllGamesEndpoint() {
        // let games;
        // await GameFactory.getAllGames().then(function(callbackValue) {
        //     games = callbackValue;
        // }, function(callbackValue) {
        //     console.error("DataEndpointController getAllGamesEndpoint(): Couldn't get all Games");
        //     console.error(callbackValue);
        // });

        // return games;
        // // return games;

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
