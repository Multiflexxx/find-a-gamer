import { Controller, Post, Get, Body } from '@nestjs/common';
import { NotifyMatch } from '../data_objects/notifymatch';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { User } from 'src/data_objects/user';
import { Region } from 'src/data_objects/region';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    flagIsSet: boolean = true;
    matchedUserID: String = "123";

    @Get()
    async handleUpdate(@Body() notifyMatch: NotifyMatch) {
      
        var result = "Test";
        // let query = QueryBuilder.getUserByEmail("benno.grimm@gmx.de");
        let query = QueryBuilder.getEmptyResult();
        console.log(query);

        //var connectionDB = ConnectToDatabaseService.getConnection();


        var myPromise = ConnectToDatabaseService.getPromise(query);
        await myPromise.then(function (callback_value) {
            // Successfully got value
            result = callback_value;
        }, function(callback_value) {
            // Error Case of Promise
            console.log(callback_value);
        });
        console.log(result.length);


        return result;
        
        //console.log(result);

        //connectionDB.connection.end
    }



    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    public static logOutput(error, result, values) {
        console.log(result);
    }
}
