import { Controller, Get, Post, Body } from '@nestjs/common';
import { SignUpDto } from './signup.dto';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';

@Controller('signupendpoint')
export class SignupendpointController {
    
    database: ConnectToDatabaseService

    @Post()
    handleUpdate(@Body() signUp: SignUpDto)
    {
        // get data => signUp.userID;

        // check database
        this.database = new ConnectToDatabaseService;

        // this.database.getResult('SELECT `PersonID` FROM FindAGamingBuddy.Persons WHERE `PersonID` = ' + signUp.userID + ';');

        // Check if user already in DB -> Redirect to login
        // If not create user in DB
    }
}
