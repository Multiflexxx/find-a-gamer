import { Controller, Get, Post, Body } from '@nestjs/common';
import { Registration } from '../../data_objects/registration';
import { RegistrationResponse } from '../../data_objects/registrationresponse';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import * as EmailValidator from 'email-validator';
import { QueryObject } from 'src/data_objects/queryobject';
import { Session } from 'src/data_objects/session';
import { UserFactory } from 'src/factory/userfactory';
import { SessionFactory } from 'src/factory/sessionfactory';
import { Region } from 'src/data_objects/region';
import { Language } from 'src/data_objects/language';
import { Game } from 'src/data_objects/game';

@Controller('registrationendpoint')
export class RegistrationendpointController {

    @Get()
    async handleRegistration(@Body() registration: Registration) {

        let randomNumber = Math.floor(Math.random() * 10000);
        registration = new Registration(
            'test@test' + randomNumber + '.com',
            'test123',
            'Grimmig',
            'Grimmig#1235',
            new Date('1999-12-31T23:00:00.000Z'),
            new Region(1, "EU"),
            [
                new Language(1)
            ],
            [
                new Game(1)
            ]
        );

        // Validate User Input
        let temp = registration.birthdate;
        registration.birthdate = new Date(temp);
        // console.log(registration.birthdate);

        let isInputValid = false;
        let myPromise = this.validateInput(registration);
        await myPromise.then(function (callbackValue) {
            isInputValid = true;
        }, function (callbackValue) {
            console.error("Failed to validate User Input");
            console.error(callbackValue);
        });


        // return empty Session if User Input is invalid
        if (!isInputValid) {
            return new RegistrationResponse(false, null, "User already exists");
        }

        // Create User using validated registration object
        let user;
        await UserFactory.createUser(registration).then(function (callbackValue) {
            user = callbackValue;
        }, function (callbackValue) {
            console.error(callbackValue);
        })

        // Create Session using created user
        // stay_logged_in for Session is false by default
        let session;
        await SessionFactory.createSessionForUser(user, false).then(function (callbackValue) {
            session = callbackValue;
        }, function (callbackValue) {
            console.error(callbackValue);
        });

        if(!session) {
            return new RegistrationResponse(false, null, "Something went wrong");
        }

        // Return Session
        return session;
    }
    private async validateInput(registration: Registration): Promise<string> {
        // Validate User input
        return new Promise(async function (resolve, reject) {
            if (!EmailValidator.validate(registration.email)) {
                reject("Email is invalid");
            }

            let queryResult: any = null;

            let emailQueryObject: QueryObject = QueryBuilder.getUserByEmail(registration.email);
            let emailPromise = ConnectToDatabaseService.getPromise(emailQueryObject);
            await emailPromise.then(function (callback_value) {
                // Successfully got value
                queryResult = callback_value;
            }, function (callback_value) {
                // Error Case of Promise
            });

            if (queryResult !== null) {
                if (queryResult.length > 0) {
                    reject("User with that email already exists");
                }
            }

            console.log(registration);

            var regex = new RegExp('([a-zA-Z0-9]{2,32})#([0-9]{4})');
            if (!regex.test(registration.discord_tag)) {
                reject("Discord Tag is invalid");
            }

            let presentDate: Date = new Date(); //Format:2020-03-24T14:30:42.836Z
            let birthdate: Date = new Date(registration.birthdate); //Format: 2000-06-05T22:00:00.000Z
            
            //Validate Birthdate
            if (Object.prototype.toString.call(birthdate) === "[object Date]") {
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

            queryResult = undefined; // reset Result

            registration.games.forEach(async game => {

                let gameQueryObject: QueryObject = QueryBuilder.getGameById(game.game_id);

                let gamePromise = ConnectToDatabaseService.getPromise(gameQueryObject);
                await gamePromise.then(function (callback_value) {
                    // Successfully got value
                    queryResult = callback_value;
                }, function (callback_value) {
                    // Error Case of Promise
                    console.error("Failed to get Game");
                    console.error(callback_value);
                });

                if (queryResult.length == 0) {
                    reject("Failed to get Game(s)");
                }
            });

            queryResult = null; // reset Result

            registration.languages.forEach(async language => {

                let languageQueryObject: QueryObject = QueryBuilder.getLanguageById(language.language_id);

                let languagePromise = ConnectToDatabaseService.getPromise(languageQueryObject);
                await languagePromise.then(function (callback_value) {
                    // Successfully got value
                    queryResult = callback_value;
                }, function (callback_value) {
                    // Error Case of Promise
                    console.error("Failed to get Language");
                    console.error(callback_value);
                });

                if (queryResult.length == 0) {
                    reject("language fail");
                }
            });

            if (registration.nickname.length > 32 || registration.nickname.length < 2 || registration.nickname === "" || registration.nickname === null) {
                reject("nickname fail");
            }

            if (registration.password_hash === null || registration.password_hash === "") {
                reject("password fail");
            }

            queryResult = undefined; // reset Result

            let regionQueryObject: QueryObject = QueryBuilder.getRegionById(registration.region.region_id);

            let regionPromise = ConnectToDatabaseService.getPromise(regionQueryObject);
            await regionPromise.then(function (callback_value) {
                // Successfully got value
                queryResult = callback_value;
            }, function (callback_value) {
                // Error Case of Promise
                console.error("Failed to get Region");
                console.error(callback_value);
            });

            if (queryResult.length == 0) {
                reject("region fail");
            }

            resolve("Success");

        });
    }
}
