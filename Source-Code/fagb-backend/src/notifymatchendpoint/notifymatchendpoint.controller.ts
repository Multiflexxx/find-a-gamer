import { Controller, Get, Post, Body, Param} from '@nestjs/common';
import { NotifyMatchDto } from './notifymatch.dto';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    flagIsSet: boolean = false;
    matchedUserID: String = "";

    @Post()
    handleUpdate(@Body() notifyMatchDto: NotifyMatchDto)
    {
        console.log(notifyMatchDto.userID);

        // check database

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
