import { Controller, Get, Post, Body } from '@nestjs/common';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';

@Controller('registrationendpoint')
export class RegistrationendpointController {
    
    database: ConnectToDatabaseService

    @Post()
    handleUpdate(@Body() registration: Registration)
    {
        // get data => registration.userID;

        // check database
        this.database = new ConnectToDatabaseService;

        // this.database.getResult('SELECT `PersonID` FROM FindAGamingBuddy.Persons WHERE `PersonID` = ' + signUp.userID + ';');

        // Check if user already in DB -> Redirect to login
        // If not create user in DB
    }
}
