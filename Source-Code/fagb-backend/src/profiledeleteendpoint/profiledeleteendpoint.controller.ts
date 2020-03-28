import { Controller, Body, Get } from '@nestjs/common';
import { DeleteProfileRequest } from 'src/data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from 'src/data_objects/deleteprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';
import { User } from 'src/data_objects/user';
import { Region } from 'src/data_objects/region';
import { Game } from 'src/data_objects/game';
import { Language } from 'src/data_objects/language';

@Controller('profiledeleteendpoint') 
export class ProfileDeleteEndpointController {
    @Get()
    async handleProfileDeleteRequest(@Body() deleteProfileRequest: DeleteProfileRequest) {
        deleteProfileRequest = new DeleteProfileRequest(
            "8bab0b42-565a-482b-b347-1ee6a2b333c2",
            new User(17, "benno.grimm@gmx.de", "updated Hash", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(1)], [new Language(2), new Language(3)])
        );

        
        // Check Session
        let session1;
        await SessionFactory.getSessionBySessionId(deleteProfileRequest.session_id).then(function(callbackValue) {
            session1 = callbackValue;
        }, function(callbackValue) {
            console.error("ProfileDeleteEndpointController handleProfileDeleteRequest(): Couldn't get Session for session_id");
            console.error(callbackValue);
        });
        
        // If is invalid or doesn't belong to user, reject
        if(!session1 || session1.user_id != deleteProfileRequest.user.user_id) {
            return new DeleteProfileResponse(false, null);
        }

        //Delete Session
        let successful = false;
        await SessionFactory.deleteSessionByUser(deleteProfileRequest.user).then(function(callbackValue) {
           successful = true;
        }, function(callbackValue) {
            console.error("Couldn't delete Session");
            console.error(callbackValue);
        });

        if (!successful) {
            return new DeleteProfileResponse(false, null);
        }

        // // Get User By Session ID

        // let result = null;
        // await UserFactory.getUserBySessionID(session1.user_id).then(function(callbackValue) {
        //     result = callbackValue;
        // }, function(callbackValue) {
        //     console.error("profiledeleteendpoint: Couldn't find user");
        //     console.error(callbackValue);
        // });

        // if (!result) {
        //     return new DeleteProfileResponse(false, null);
        // }

        // Delete User

        await UserFactory.deleteUser(deleteProfileRequest.user).then(function(callbackValue){
            successful = true;
        }, function (callbackValue) {
            console.error("profiledeleteendpoint: Couldn't delete user");
            console.error(callbackValue);
        })

        if (!successful) {
            return new DeleteProfileResponse(false, null);
        }

        return new DeleteProfileResponse(true, deleteProfileRequest.user);
    }
}