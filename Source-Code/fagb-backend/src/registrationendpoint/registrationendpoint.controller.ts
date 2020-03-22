import { Controller, Get, Post, Body } from '@nestjs/common';
import { Registration } from '../data_objects/registration';
import { RegistrationResponse } from '../data_objects/registrationresponse';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import * as EmailValidator from 'email-validator';
import { QueryObject } from 'src/data_objects/queryobject';
import { Session } from 'src/data_objects/session';

@Controller('registrationendpoint')
export class RegistrationendpointController {

    @Post()
    async handleRegistration(@Body() registration: Registration) {

        let isInputValid = false;
        
        let myPromise = this.validateInput(registration);
        await myPromise.then(function (callbackValue) {
            isInputValid = true;
        }, function(callbackValue) {
            console.log(callbackValue);
        });

        // TODO: CREATE SESSION 
        // TODO: Validate Birthdate

        console.log(registration); // => Does work!

        let myRegistration:Registration = registration;

        console.log(myRegistration.discord_tag);

        if (!isInputValid) {
            return new RegistrationResponse(false, null);
        }
        
        // TEST:
        // Create User and return Session
        return new RegistrationResponse(true, new Session("test_session", 2, true));
    }
    private async validateInput(registration: Registration): Promise<boolean> {
        // Validate User input
        return new Promise(async function (resolve, reject) {
            if (!EmailValidator.validate(registration.email)) {
                reject(false);
            }

            let queryResult: any;

            let emailQueryObject: QueryObject = QueryBuilder.getUserByEmail(registration.email);
            let emailPromise = ConnectToDatabaseService.getPromise(emailQueryObject);
            await emailPromise.then(function (callback_value) {
                // Successfully got value
                queryResult = callback_value;
            }, function (callback_value) {
                // Error Case of Promise
                console.log(callback_value);
            });

            if (queryResult.length > 0) {
                reject(false);
            }

            var regex = new RegExp('([a-zA-Z0-9]{2,32})#([0-9]{4})');
            if (!regex.test(registration.discord_tag)) {
                reject(false);
            }

            //Format: mm/dd/yyyy
            /*if (registration.birthdate) {
                return false;
            }*/

            queryResult = undefined; // reset Result

            registration.games.forEach(async game => {

                let gameQueryObject: QueryObject = QueryBuilder.getGameById(game.game_id);

                let gamePromise = ConnectToDatabaseService.getPromise(gameQueryObject);
                await gamePromise.then(function (callback_value) {
                    // Successfully got value
                    queryResult = callback_value;
                }, function (callback_value) {
                    // Error Case of Promise
                    console.log(callback_value);
                });

                if (queryResult.length == 0) {
                    reject(false);
                }
            });

            queryResult = undefined; // reset Result

            registration.languages.forEach(async language => {

                let languageQueryObject: QueryObject = QueryBuilder.getLanguageById(language.language_id);

                let languagePromise = ConnectToDatabaseService.getPromise(languageQueryObject);
                await languagePromise.then(function (callback_value) {
                    // Successfully got value
                    queryResult = callback_value;
                }, function (callback_value) {
                    // Error Case of Promise
                    console.log(callback_value);
                });

                if (queryResult.length == 0) {
                    reject(false);
                }
            });

            if (registration.nickname.length > 32 || registration.nickname.length < 2 || registration.nickname === "" || registration.nickname === null) {
                reject(false);
            }

            if (registration.password_hash === null || registration.password_hash === "") {
                reject(false);
            }

            queryResult = undefined; // reset Result

            let regionQueryObject: QueryObject = QueryBuilder.getRegionById(registration.region.region_id);

            let regionPromise = ConnectToDatabaseService.getPromise(regionQueryObject);
            await regionPromise.then(function (callback_value) {
                // Successfully got value
                queryResult = callback_value;
            }, function (callback_value) {
                // Error Case of Promise
                console.log(callback_value);
            });

            if (queryResult.length == 0) {
                reject(false);
            }

            resolve(true);
        });
    }
}
