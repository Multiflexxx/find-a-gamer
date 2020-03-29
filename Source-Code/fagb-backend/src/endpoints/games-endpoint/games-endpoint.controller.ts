import { Controller, Get } from '@nestjs/common';
import { GameFactory } from 'src/factory/gamefactory';

@Controller('gamesendpoint')
export class GamesEndpointController {

    @Get()
    public async getAllGamesEndpoint() {
        let games;
        await GameFactory.getAllGames().then(function(callbackValue) {
            games = callbackValue;
        }, function(callbackValue) {
            console.error("DataendpointController getAllRgamesEndpoint(): Couldn't get all Games");
            console.error(callbackValue);
        });

        return games;
    }
    
}
