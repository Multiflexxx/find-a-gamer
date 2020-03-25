import { Controller, Body, Get } from '@nestjs/common';
import { DeleteProfileRequest } from 'src/data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from 'src/data_objects/deleteprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';

@Controller('profiledeleteendpoint') 
export class ProfileDeleteEndpointController {
    @Get()
    async handleProfileDeleteRequest(@Body() deleteProfileRequest: DeleteProfileRequest) {
        
        let session = null;
        await SessionFactory.getSessionByUser(deleteProfileRequest.user).then(function(callbackValue) {
            session = callbackValue;
        }, function(callbackValue) {
            console.error("Couldn't get Session for User");
            console.error(callbackValue);
        });

        if (!session || session.user_id != deleteProfileRequest.user.user_id) {
            return new DeleteProfileResponse(false, null);
        }

        //Delete Session
        let successfull = false;
        await SessionFactory.deleteSessionByUser(session.user_id).then(function(callbackValue) {
           successfull = true;
        }, function(callbackValue) {
            console.error("Couldn't delete Session");
            console.error(callbackValue);
        });

        if (!successfull) {
            return new DeleteProfileResponse(false, null);
        }

        // Get User By Session ID

        let result = null;
        await UserFactory.getUserBySessionID(session.user_id).then(function(callbackValue) {
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
            successfull = true;
        }, function (callbackValue) {
            console.error("profiledeleteendpoint: Couldn't delete user");
            console.error(callbackValue);
        })

        if (!successfull) {
            return new DeleteProfileResponse(false, null);
        }
    }
}