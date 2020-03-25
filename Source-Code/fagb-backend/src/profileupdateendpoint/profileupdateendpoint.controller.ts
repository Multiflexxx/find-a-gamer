import { Controller, Body, Get } from '@nestjs/common';
import { EditProfileRequest } from 'src/data_objects/editprofilerequest';
import { EditProfileResponse } from 'src/data_objects/editprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';

@Controller('profileupdateendpoint')
export class ProfileUpdateEndpointController {
    @Get()
    async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest) {
        // Check Session
        let session;
        await SessionFactory.getSessionByUser(editProfileRequest.user).then(function(callbackValue) {
            session = callbackValue;
        }, function(callbackValue) {
            console.error("Couldn't get Session for User");
            console.error(callbackValue);
        });
        
        if(!session || session.user_id != editProfileRequest.user.user_id) {
            return new EditProfileResponse(false, null);
        }

        // Update User
        let user;
        await UserFactory.updateUser(editProfileRequest.user).then(function(callbackValue) {
            user = callbackValue;
        }, function(callbackValue) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't update User")
            console.error(callbackValue);
        });

        if(!user) {
            return new EditProfileResponse(false, null);
        }

        return new EditProfileResponse(true, user);
    }
}
