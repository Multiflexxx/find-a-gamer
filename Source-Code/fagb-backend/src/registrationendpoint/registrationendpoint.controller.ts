import { Controller, Get, Post, Body } from '@nestjs/common';
import { Registration } from '../data_objects/registration';
import { RegistrationResponse } from '../data_objects/registrationresponse';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import * as EmailValidator from 'email-validator';

@Controller('registrationendpoint')
export class RegistrationendpointController {
    
    database: ConnectToDatabaseService;
    validation: boolean;

    @Post()
    handleRegistration(@Body() registration: Registration): RegistrationResponse
    {
        if(!this.validateInput(registration)) {
            return new RegistrationResponse(false, null);
        }
        
        

        



        // get data => registration.userID;

        // check database
        this.database = new ConnectToDatabaseService;

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

        if (registration.birthdate) {

        }

        if (registration.games) {

        }
        
        if (registration.languages) {

        }

        if (!registration.nickname) {

        }

        if (registration.password_hash) {

        }

        if (registration.region) {
            
        }

        return true;
    }
    

}