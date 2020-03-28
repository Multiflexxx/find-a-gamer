import { Controller, Body, Get } from '@nestjs/common';
import { EditProfileRequest } from 'src/data_objects/editprofilerequest';
import { EditProfileResponse } from 'src/data_objects/editprofileresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { UserFactory } from 'src/factory/userfactory';
import { User } from 'src/data_objects/user';
import { Region } from 'src/data_objects/region';
import { Game } from 'src/data_objects/game';
import { Language } from 'src/data_objects/language';
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from 'src/connecttodatabase/connecttodatabase.service';
import { QueryObject } from 'src/data_objects/queryobject';

@Controller('profileupdateendpoint')
export class ProfileUpdateEndpointController {
    // @Get()
    // async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest) {
    //     // Fake Update for Testing
    //     editProfileRequest = new EditProfileRequest(
    //         "b9117c5e-8c9e-4e5e-be97-717677c8ecfd",
    //         new User(2, "benno.grimm@gmx.de", "updated Hash 4", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(2)], [new Language(10), new Language(11)])
    //     );


    //     // Check Session
    //     let session1;
    //     await SessionFactory.getSessionBySessionId(editProfileRequest.session_id).then(function(callbackValue) {
    //         session1 = callbackValue;
    //     }, function(callbackValue) {
    //         console.error("ProfileUpdateEndpointController handleProfileUpdateRequest(): Couldn't get Session for session_id");
    //         console.error(callbackValue);
    //     });
        
    //     // If is invalid or doesn't belong to user, reject
    //     if(!session1 || session1.user_id != editProfileRequest.user.user_id) {
    //         return new EditProfileResponse(false, null);
    //     }

    //     // Update User
    //     let user;
    //     await UserFactory.updateUser(editProfileRequest.user).then(function(callbackValue) {
    //         user = callbackValue;
    //     }, function(callbackValue) {
    //         console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't update User")
    //         console.error(callbackValue);
    //     });

    //     // If failed to update user, return 
    //     if(!user) {
    //         return new EditProfileResponse(false, null);
    //     }

    //     // Return updated user
    //     return new EditProfileResponse(true, user);
    // }

    @Get()
    async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest) {
        // Fake Input from Frontend
        editProfileRequest = new EditProfileRequest(
            "b9117c5e-8c9e-4e5e-be97-717677c8ecfd",
            new User(2, "benno.grimm@gmx.de", "updated Hash 5", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(3), new Game(1)], [new Language(10), new Language(11)])
        );

        // check if session is valid and belongs to user to be edited
        let session;
        await SessionFactory.getSessionBySessionId(editProfileRequest.session_id).then(function(callbackValue) {
            session = callbackValue;
        }, function(callbackValue) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): couldn't get Session")
            console.error(callbackValue);
        });

        if(!session || session.user_id != editProfileRequest.user.user_id) {
            return new EditProfileResponse(false, null);
        }

        // Delete old User Game Pairs
        let query = QueryBuilder.deleteUserGamePairsByUser(editProfileRequest.user);
        let successful;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            successful = true;
        }, function(callbackValue) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't delete UserGamePairs");
            console.error(callbackValue);
        });

        if(!successful) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Value successful false or null after deleting UserGamePairs");
            return new EditProfileResponse(false, null);
        }

        // Create new User Game Pairs
        for(let game of editProfileRequest.user.games) {
            query = QueryBuilder.createUserGamePair(editProfileRequest.user, game);
            successful = null;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't create UserGamePairs");
                console.error(callbackValue);
            });

            if(!successful) {
                console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Value successful false or null after creating UserGamePairs for Game");
                console.error(game);
                return new EditProfileResponse(false, null);
            }
        }

        // Get Updated Games
        query = QueryBuilder.getGamesByUser(editProfileRequest.user);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            result = callbackValue;
            console.log(callbackValue);
        }, function(callbackValue) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't get new UserGamePairs");
            console.error(callbackValue);
        });

        if(!result || !result[0]) {
            console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): result is empty or null after getting Games for User");
            console.error(result);
            return new EditProfileResponse(false, null);
        }

        let newGames: Game[] = [];
        for(let game of result) {
            newGames.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
        }

        return newGames;

    }
}
