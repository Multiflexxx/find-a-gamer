import { Controller, Get } from '@nestjs/common';
import { RegionFactory } from 'src/factory/regionfactory';
import { GameFactory } from 'src/factory/gamefactory';
import { LanguageFactory } from 'src/factory/languagefactory';

@Controller('dataendpoint')
export class DataendpointController {
    @Get()
    public async getAllRegionsEndpoint() {
        let regions;
        await RegionFactory.getAllRegions().then(function(callbackValue) {
            regions = callbackValue;
        }, function(callbackValue) {
            console.error("DataendpointController getAllRegionsEndpoint(): Couldn't get all Regions");
            console.error(callbackValue);
        });

        return regions;
    }

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

    public async getAllLanguagesEndpoint() {
        let languages;
        await LanguageFactory.getAllLanguages().then(function(callbackValue) {
            languages = callbackValue;
        }, function(callbackValue) {
            console.error("DataendpointController getAllRgamesEndpoint(): Couldn't get all Games");
            console.error(callbackValue);
        });

        return languages;
    }
}
