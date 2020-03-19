import { Controller, Get, Post, Body } from '@nestjs/common';
import { Registration } from '../data_objects/registration';
import { RegistrationResponse } from '../data_objects/registrationresponse';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import * as EmailValidator from 'email-validator';
import { strict } from 'assert';

@Controller('registrationendpoint')
export class RegistrationendpointController {
    
    database: ConnectToDatabaseService;
    validation: boolean;

    @Post()
    handleRegistration(@Body() registration: Registration): RegistrationResponse
    {
        this.database = new ConnectToDatabaseService();

        if(!this.validateInput(registration)) {
            return new RegistrationResponse(false, null);
        }
        
        

        



        // get data => registration.userID;

        // check database
        

        console.log(JSON.stringify(this.database));

        // this.database.getResult('SELECT `PersonID` FROM FindAGamingBuddy.Persons WHERE `PersonID` = ' + signUp.userID + ';');

        // Check if user already in DB -> Redirect to login
        // If not create user in DB

        return null;
    }

    private validateInput(registration: Registration): boolean {
        // Validate User input
        
        if (!EmailValidator.validate(registration.email)) {
            return false;
        }

        var regex = new RegExp('([a-zA-Z0-9]*)#(\d{4})');
        if (!regex.test(registration.discord_tag)) {
            return false; 
        }

        //Format: mm/dd/yyyy
        if (registration.birthdate) {
            return false;
        }

        var gameString:string = QueryBuilder.getGames();
    
        var resultSet = this.database.getResult(gameString);

        resultSet.forEach(result => {
            registration.games.forEach(game => {
                if (game.game_id !== result.game_id) {
                    return false;
                }
            })
        })
        
        var languageString:string = QueryBuilder.getLanguages();
    
        var resultSet = this.database.getResult(languageString);
        
        resultSet.forEach(result => {
            registration.languages.forEach(language => {
                if (result.language_id !== language.language_id) {
                    return false;
                }
            })
        });

        if (!(registration.nickname.length > 32 && registration.nickname === "" && registration.nickname === null)) {
            return false;
        }

        if (registration.password_hash === null && registration.password_hash === "") {
            return false;
        }

        var regionString:string = QueryBuilder.getRegions();
    
        var resultSet = this.database.getResult(regionString);
        
        resultSet.forEach(element => {
            if (registration.region.region_id !== element.region_id) {
                return false;
            }
        });
        
        return true;
    }
    

}