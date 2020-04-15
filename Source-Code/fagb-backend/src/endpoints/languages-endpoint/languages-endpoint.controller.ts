import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { LanguageFactory } from '../../factory/languagefactory';
import { Language } from 'src/data_objects/language';

@Controller('languagesendpoint')
export class LanguagesEndpointController {

    @Get()
    public async getAllLanguagesEndpoint(): Promise<Language[]> {
        const languages: Language[] = await LanguageFactory.getAllLanguages();

        if(!languages) {
            console.error('DataendpointController getAllGamesEndpoint(): Couldn\'t get all Games');
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t get all Languages'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return languages;
    }
}
