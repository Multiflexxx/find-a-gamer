import { Controller, Body, Get } from '@nestjs/common';
import { EditProfileRequest } from 'src/data_objects/editprofilerequest';
import { EditProfileResponse } from 'src/data_objects/editprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';
import { User } from 'src/data_objects/user';
import { Region } from 'src/data_objects/region';
import { Game } from 'src/data_objects/game';
import { Language } from 'src/data_objects/language';

@Controller('profileupdateendpoint')
export class ProfileUpdateEndpointController {
    @Get()
    async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest) {
        // Fake Update for Testing
        editProfileRequest = new EditProfileRequest(
            "b9117c5e-8c9e-4e5e-be97-717677c8ecfd",
            new User(2, "benno.grimm@gmx.de", "updated Hash", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(1)], [new Language(2), new Language(3)])
        );


        // Check Session
        let session1;
        await SessionFactory.getSessionBySessionId(editProfileRequest.session_id).then(function(callbackValue) {
            session1 = callbackValue;
        }, function(callbackValue) {
            console.error("ProfileUpdateEndpointController handleProfileUpdateRequest(): Couldn't get Session for session_id");
            console.error(callbackValue);
        });
        
        // If is invalid or doesn't belong to user, reject
        if(!session1 || session1.user_id != editProfileRequest.user.user_id) {
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

        // If failed to update user, return 
        if(!user) {
            return new EditProfileResponse(false, null);
        }

        // Return updated user
        return new EditProfileResponse(true, user);
    }
}
