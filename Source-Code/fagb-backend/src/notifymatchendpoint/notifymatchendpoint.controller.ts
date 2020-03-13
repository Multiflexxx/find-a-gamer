import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { NotifyMatchDto } from './notifymatch.dto';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    flagIsSet: boolean = false;
    matchedUserID: String = "";
    database: ConnectToDatabaseService

    @Post()
    handleUpdate(@Body() notifyMatchDto: NotifyMatchDto)
    {
        console.log(notifyMatchDto.userID);

        // check database
        this.database = new ConnectToDatabaseService;

        this.database.getResult('SELECT `PersonID` FROM FindAGamingBuddy.Persons WHERE `PersonID` = ' + notifyMatchDto.userID + ';');

        if(this.flagIsSet)
        {
            return '{"matchFound":true, "matchedUserID":"' + this.matchedUserID + '"}';
        }

        else
        {
            return '{"matchFound":false}';
        }
    }
}
