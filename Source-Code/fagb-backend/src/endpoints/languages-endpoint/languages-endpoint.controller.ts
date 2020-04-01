import { Controller, Get } from '@nestjs/common';
import { LanguageFactory } from '../../factory/languagefactory';

@Controller('languagesendpoint')
export class LanguagesEndpointController {

    @Get()
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
