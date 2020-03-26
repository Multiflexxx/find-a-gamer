import { Controller, Body, Get } from '@nestjs/common';
import { DeleteProfileRequest } from 'src/data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from 'src/data_objects/deleteprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';

@Controller('profiledeleteendpoint') 
export class ProfileDeleteEndpointController {
    @Get()
    async handleProfileDeleteRequest(@Body() deleteProfileRequest: DeleteProfileRequest) {
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
        await SessionFactory.deleteSessionByUser(session1.user_id).then(function(callbackValue) {
           successful = true;
        }, function(callbackValue) {
            console.error("Couldn't delete Session");
            console.error(callbackValue);
        });

        if (!successful) {
            return new DeleteProfileResponse(false, null);
        }

        // Get User By Session ID

        let result = null;
        await UserFactory.getUserBySessionID(session1.user_id).then(function(callbackValue) {
            result = callbackValue;
        }, function(callbackValue) {
            console.error("profiledeleteendpoint: Couldn't find user");
            console.error(callbackValue);
        });

        if (!result) {
            return new DeleteProfileResponse(false, null);
        }

        // Delete User

        await UserFactory.deleteUser(result).then(function(callbackValue){
            successful = true;
        }, function (callbackValue) {
            console.error("profiledeleteendpoint: Couldn't delete user");
            console.error(callbackValue);
        })

        if (!successful) {
            return new DeleteProfileResponse(false, null);
        }
    }
}