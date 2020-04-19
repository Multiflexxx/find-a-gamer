import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { Registration } from '../../data_objects/registration';
import { RegistrationResponse } from '../../data_objects/registrationresponse';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import * as EmailValidator from 'email-validator';
import { QueryObject } from '../../data_objects/queryobject';
import { Session } from '../../data_objects/session';
import { UserFactory } from '../../factory/userfactory';
import { SessionFactory } from '../../factory/sessionfactory';
import { Region } from '../../data_objects/region';
import { Language } from '../../data_objects/language';
import { Game } from '../../data_objects/game';
import { LanguageFactory } from '../../factory/languagefactory';
import { User } from '../../data_objects/user';
import { GameFactory } from '../../factory/gamefactory';
import { RegionFactory } from '../../factory/regionfactory';
import { Discord } from '../../factory/discord';
import { DiscordInformation } from '../../data_objects/discordinformation';

@Controller('registrationendpoint')
export class RegistrationendpointController {

    @Post()
    public async handleRegistration(@Body() registration: Registration): Promise<Session> {

        // let randomNumber = Math.floor(Math.random() * 10000);
        // registration = new Registration(
        //     'mrsbody@sex' + randomNumber + '.com',
        //     'test123',
        //     'Grimmig',
        //     'Grimmig#1235',
        //     new Date('1999-12-31T23:00:00.000Z'),
        //     new Region(1, null),
        //     [
        //         new Language(1)
        //     ],
        //     [
        //         new Game(1)
        //     ]
        // );
        // console.log(registration.email);

        // Convert to proper Date Format
        registration.birthdate = new Date(registration.birthdate);

        // return empty Session if User Input is invalid
        if (!(await RegistrationendpointController.validateInput(registration))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Invalid user input'
            }, HttpStatus.NOT_ACCEPTABLE);
        }


        // Check if user already exists
        if((await UserFactory.checkIfUserExistsByEmail(registration.email))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Email already registered'
            }, HttpStatus.NOT_ACCEPTABLE);
        }


        // Create User using validated registration object
        const user: User = await UserFactory.createUser(registration);
        if(!user) {
            console.error('RegistrationEndpoint handleRegistration(): Couldn\'t create User');
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Something went wrong'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Create Session using created user
        // stay_logged_in for Session is false by default
        const session: Session = await SessionFactory.createSessionForUser(user, false);
        if(!session) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t log in user'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Return Session
        return session;
    }

    /**
     * Checks registration Input for validity, return false if invalid, otherwise returns true
     * @param registration Registration to checked
     */
    private static async validateInput(registration: Registration): Promise<boolean> {

        // Check if email has valid format
        if (!EmailValidator.validate(registration.email)) {
            return false;
        }

        // Check if discord tag has valid format
        const regex = new RegExp('([a-zA-Z0-9]{2,32})#([0-9]{4})');
        if (!regex.test(registration.discord_tag)) {
            return false;
        }

        // Check if Birthdate is valid and in acceptable time range
        const presentDate: Date = new Date(); // Format:2020-03-24T14:30:42.836Z
        const birthdate: Date = new Date(registration.birthdate); // Format: 2000-06-05T22:00:00.000Z

        // Validate Birthdate
        if (Object.prototype.toString.call(birthdate) === '[object Date]') {
            // it is a date
            if (isNaN(birthdate.getTime())) {
                // date is not valid
                return false;
            } else {
                // date is valid
                if (birthdate > presentDate) {
                    return false;
                }
            }
        } else {
            // not a date
            return false;
        }

        // Check if all game_ids are valid
        registration.games.forEach(async game => {
            if(!(await GameFactory.getGameById(game.game_id))) {
                return false;
            }
        });

        // Check if all language_ids are valid
        registration.languages.forEach(async language => {
            if(!(await LanguageFactory.getLanguageById(language.language_id))) {
                return false;
            }
        });

        // Check if region is valid
        if(!(await RegionFactory.getRegionById(registration.region.region_id))) {
            return false;
        }

        if (registration.nickname.length > 32 || registration.nickname.length < 2 || registration.nickname === '' || registration.nickname === null) {
            return false;
        }

        if (registration.password_hash === null || registration.password_hash === '') {
            return false;
        }

        // finally check if discord token is valid
        if(!registration.discordToken || !(new RegExp('([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})').test(registration.discordToken))) {
            return false;
        }

        const discordInfo: DiscordInformation = await Discord.getDiscordInformation(registration.discordToken)
        if(!discordInfo || `${discordInfo.username}#${discordInfo.discriminator}` !== registration.discord_tag) {
            return false;
        }

        return true;

    }
}
