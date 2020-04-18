import { Controller, Body, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { DeleteProfileRequest } from '../../data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from '../../data_objects/deleteprofileresponse';
import { SessionFactory } from '../../factory/sessionfactory';
import { UserFactory } from '../../factory/userfactory';
import { User } from '../../data_objects/user';
import { Region } from '../../data_objects/region';
import { Game } from '../../data_objects/game';
import { Language } from '../../data_objects/language';
import { Session } from '../../data_objects/session';
import { MatchFactory } from '../../factory/matchfactory';

@Controller('profiledeleteendpoint')
export class ProfileDeleteEndpointController {
    @Post()
    public async handleProfileDeleteRequest(@Body() deleteProfileRequest: DeleteProfileRequest): Promise<DeleteProfileResponse> {
        /*deleteProfileRequest = new DeleteProfileRequest(
            "3e8de529-977b-4b2e-8bf8-c4aa007d6202",
            new User(16, "benno.grimm@gmx.de", "updated Hash", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(1)], [new Language(2), new Language(3)])
        );*/

        let user: User = new User(
            deleteProfileRequest.publicUser.user_id,
            null,
            null,
            deleteProfileRequest.publicUser.nickname,
            deleteProfileRequest.publicUser.discord_tag,
            deleteProfileRequest.publicUser.profile_picture,
            deleteProfileRequest.publicUser.cake_day,
            null,
            deleteProfileRequest.publicUser.biography,
            deleteProfileRequest.publicUser.region,
            deleteProfileRequest.publicUser.games,
            deleteProfileRequest.publicUser.languages
        );


        // Check Session
        const session: Session = await SessionFactory.getSessionBySessionId(deleteProfileRequest.session_id);

        // If is invalid or doesn't belong to user, reject
        if(!session || session.user_id !== deleteProfileRequest.publicUser.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Session not authorized to delete User'
            }, HttpStatus.UNAUTHORIZED);
        }

        // Check if user has open matchMakingRequests
        if((await MatchFactory.checkOpenMatchMakingRequest(session.user_id))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'User still has open Matchmaking Requests'
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Delete Session
        const successful: boolean = await SessionFactory.deleteSessionByUser(user);
        if (!successful) {
            console.error('ProfileDeleteEndpoint: Couldn\'t delete User sessions');
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to delete old User sessions'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Delete User
        user  = await UserFactory.deleteUser(user);

        if (!user) {
            console.error('ProfileDeleteEndpoint: Couldn\'t delete user');
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to delete old User sessions'
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new DeleteProfileResponse(true, await UserFactory.userToPublicUser(user));
    }
}