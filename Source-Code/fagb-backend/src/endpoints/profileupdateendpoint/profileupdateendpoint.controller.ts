import { Controller, Body, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { EditProfileRequest } from '../../data_objects/editprofilerequest';
import { EditProfileResponse } from '../../data_objects/editprofileresponse';
import { SessionFactory } from '../../factory/sessionfactory';
import { UserFactory } from '../../factory/userfactory';
import { User } from '../../data_objects/user';
import { Region } from '../../data_objects/region';
import { Game } from '../../data_objects/game';
import { Language } from '../../data_objects/language';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryObject } from '../../data_objects/queryobject';
import { UserGamePairFactory } from '../../factory/usergamepairfactory';
import { GameFactory } from '../../factory/gamefactory';
import { UserLanguagePair } from '../../data_objects/userlanguagepair';
import { UserLanguagePairFactory } from '../../factory/userlanguagepairfactory';
import { LanguageFactory } from '../../factory/languagefactory';
import { RegionFactory } from '../../factory/regionfactory';
import { Session } from 'src/data_objects/session';

@Controller('profileupdateendpoint')
export class ProfileUpdateEndpointController {

    @Post()
    public async handleProfileUpdateRequest(@Body() editProfileRequest: EditProfileRequest): Promise<EditProfileResponse> {

        let user: User = await UserFactory.getUserBySessionID(editProfileRequest.session_id);
        if(!user || user.user_id != editProfileRequest.publicUser.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Not authorized to change this user"
            }, HttpStatus.UNAUTHORIZED);
        }

        if(editProfileRequest.oPassword != null && editProfileRequest.nPassword != null) {
            if(user.password_hash != editProfileRequest.oPassword) {
                throw new HttpException({
                    status: HttpStatus.UNAUTHORIZED,
                    error: "Wrong Password"
                }, HttpStatus.UNAUTHORIZED);
            }
        }

        if(!(await ProfileUpdateEndpointController.validateInput(editProfileRequest))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "Invalid Input"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        let result = await UserFactory.updateUser(editProfileRequest);
        if(!result) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to update User"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new EditProfileResponse(true, result);
    }

    private static async validateInput(editProfileRequest: EditProfileRequest): Promise<boolean> {
        if(editProfileRequest.publicUser != null) {
            // Validate Region
            let region: Region = await RegionFactory.getRegionById(editProfileRequest.publicUser.region.region_id);
            if(!region) {
                console.error("ProfileUpdateEndpointController validateInput(): Couldn't get region");
                return false;
            }

            // Validate Languages
            editProfileRequest.publicUser.languages.forEach(async lang => {
                let language: Language = await LanguageFactory.getLanguageById(lang.language_id);
                if(!language) {
                    console.error("ProfileUpdateEndpointController validateInput(): Couldn't get language");
                    return false;
                }
            });
            

            // Validate Games
            editProfileRequest.publicUser.games.forEach(async g => {
                let game: Game = await GameFactory.getGameById(g.game_id);
                if(!game) {
                    console.error("ProfileUpdateEndpointController validateInput(): Couldn't get game");
                    return false;
                }
            });

            if(editProfileRequest.publicUser.biography.length > 500) {
                console.error("ProfileUpdateEndpointController validateInput(): Biography exceeded maximum length");
                return false;
            }
        }

        return true;
    }

        // // check if session is valid and belongs to user to be edited
        // let session: Session = await SessionFactory.getSessionBySessionId(editProfileRequest.session_id);
        // if(!session || session.user_id != editProfileRequest.user.user_id) {
        //     throw new HttpException({
        //         status: HttpStatus.UNAUTHORIZED,
        //         error: "Session not authorized to update Profile"
        //     }, HttpStatus.UNAUTHORIZED);
        // }

        // // // Delete old User Game Pairs
        // // let query = QueryBuilder.deleteUserGamePairsByUser(editProfileRequest.user);
        // // let successful;
        // // await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
        // //     successful = true;
        // // }, function(callbackValue) {
        // //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't delete UserGamePairs");
        // //     console.error(callbackValue);
        // // });

        // // if(!successful) {
        // //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Value successful false or null after deleting UserGamePairs");
        // //     return new EditProfileResponse(false, null);
        // // }

        // // // Create new User Game Pairs
        // // for(let game of editProfileRequest.user.games) {
        // //     query = QueryBuilder.createUserGamePair(editProfileRequest.user, game);
        // //     successful = null;
        // //     await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
        // //         successful = true;
        // //     }, function(callbackValue) {
        // //         console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't create UserGamePairs");
        // //         console.error(callbackValue);
        // //     });

        // //     if(!successful) {
        // //         console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Value successful false or null after creating UserGamePairs for Game");
        // //         console.error(game);
        // //         return new EditProfileResponse(false, null);
        // //     }
        // // }

        // let success: boolean = await UserGamePairFactory.updateUserGamePairs(editProfileRequest.user);

        // if(!success) {
        //     throw new HttpException({
        //         status: HttpStatus.INTERNAL_SERVER_ERROR,
        //         error: "Couldn't update games"
        //     }, HttpStatus.INTERNAL_SERVER_ERROR);
        // }


        // // Get Updated Games
        // // let query = QueryBuilder.getGamesByUser(editProfileRequest.user);
        // // let result;
        // // await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
        // //     result = callbackValue;
        // //     console.log(callbackValue);
        // // }, function(callbackValue) {
        // //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't get new UserGamePairs");
        // //     console.error(callbackValue);
        // // });

        // // if(!result || !result[0]) {
        // //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): result is empty or null after getting Games for User");
        // //     console.error(result);
        // //     return new EditProfileResponse(false, null);
        // // }

        // // let newGames: Game[] = [];
        // // for(let game of result) {
        // //     newGames.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
        // // }

        // let games: Game[] = await GameFactory.getGamesForUser(editProfileRequest.publicUser);
        // if(!games) {
        //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't get Games for User");
        //     throw new HttpException({
        //         status: HttpStatus.INTERNAL_SERVER_ERROR,
        //         error: "Couldn't get updated Games"
        //     }, HttpStatus.INTERNAL_SERVER_ERROR);
        // }
        // editProfileRequest.user.games = games;


        // // Update UserLanguagePairs
        // success = await UserLanguagePairFactory.updateUserLanguagePairs(editProfileRequest.user);
        // if(!success) {
        //     throw new HttpException({
        //         status: HttpStatus.INTERNAL_SERVER_ERROR,
        //         error: "Couldn't update Languages"
        //     }, HttpStatus.INTERNAL_SERVER_ERROR);
        // }

        // let languages: Language[] = await LanguageFactory.getLanguagesForUser(editProfileRequest.user);
        // if(!languages) {
        //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't get Languages for User");
        //     return false;
        // }
        // editProfileRequest.user.languages = languages;

        // // Update other User Fields
        // let query = QueryBuilder.updateUser(editProfileRequest.user);
        // success = null;
        // await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
        //     success = true;
        // }, function(callbackValue) {
        //     console.error("ProfileUpdateEndpoint handleProfileUpdateRequest(): Couldn't update User");
        // });

        // if(!success) {
        //     return new EditProfileResponse(false, null);
        // }

        // return new EditProfileResponse(true, UserFactory.userToPublicUser(editProfileRequest.user));


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
}
