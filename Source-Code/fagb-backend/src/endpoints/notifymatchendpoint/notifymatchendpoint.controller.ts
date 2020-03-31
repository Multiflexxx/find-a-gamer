import { Controller, Post, Get, Body } from '@nestjs/common';
import { NotifyMatch } from '../../data_objects/notifymatch';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { User } from 'src/data_objects/user';
import { Region } from 'src/data_objects/region';
import { UserFactory } from 'src/factory/userfactory';
import { v4 as uuidv4 } from 'uuid';
import { QueryObject } from 'src/data_objects/queryobject';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    @Get()
    async handleUpdate(@Body() notifyMatch: NotifyMatch) {

        // await ConnectToDatabaseService.testQuery("Select * from User WHERE email = 'test@test16.com';").then(function(callbackValue) {
        //     console.log(callbackValue);
        // }, function(callbackValue) {
        //     console.log(callbackValue);
        // });

        // let test;

        // for(let i = 0; i < 100; i++) {
        //     test = i;
        //     console.log(test);
        // }

        // UUID: b9117c5e-8c9e-4e5e-be97-717677c8ecfd

        // await ConnectToDatabaseService.getPromise(new QueryObject("Select BIN_TO_UUID((Select UUID_TO_BIN('b9117c5e-8c9e-4e5e-be97-717677c8ecfd')));")).then(function(callbackValue) {
        //     console.log(callbackValue);
        // }, function(callbackValue) {
        //     console.error(callbackValue);
        // })
        // return uuidv4();
      
        // let result: any;
        // let query = QueryBuilder.getLanguageById(1);
       
        // console.log(query);

        // var myPromise = ConnectToDatabaseService.getPromise(query);
        // await myPromise.then(function (callback_value) {
        //     // Successfully got value
        //     result = callback_value;
        // }, function(callback_value) {
        //     // Error Case of Promise
        //     console.log(callback_value);
        // });

        // console.log(result.length);

        // return result;
        // for(let i = 0; i < 100; i++) {
        //     console.log(uuidv4());
        // }
        // await UserFactory.getUserByEmail("benno.grimm@gmx.de").then(function(callbackValue) {
        //     console.log(callbackValue);
        //     return callbackValue;
        // }, function(callbackValue) {
        //     console.error(callbackValue);
        //     return '{"id": "' +  uuidv4() + '"}';
        // });
        // return '{"id": "' +  uuidv4() + '"}';
    }
}
