import { Controller, Post, Body } from '@nestjs/common';
import { NotifyMatch } from '../data_objects/notifymatch';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    flagIsSet: boolean = true;
    matchedUserID: String = "123";
    database: ConnectToDatabaseService

    @Post()
    handleUpdate(@Body() notifyMatch: NotifyMatch): string {
        console.log(notifyMatch.userID);

        // check database
        //this.database = new ConnectToDatabaseService;

        //this.database.getResult('SELECT `PersonID` FROM FindAGamingBuddy.Persons WHERE `PersonID` = ' + notifyMatch.userID + ';');

        if (this.flagIsSet) {
            return '{"matchFound":true, "matchedUserID":"' + this.matchedUserID + '"}';
        } else {
            return '{"matchFound":false}';
        }
    }
}
