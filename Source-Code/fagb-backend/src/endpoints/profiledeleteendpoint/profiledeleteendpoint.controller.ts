import { Controller, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteProfileRequest } from '../../data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from '../../data_objects/deleteprofileresponse';
import { SessionFactory } from '../../factory/sessionfactory';
import { UserFactory } from '../../factory/userfactory';
import { User } from '../../data_objects/user';
import { Region } from '../../data_objects/region';
import { Game } from '../../data_objects/game';
import { Language } from '../../data_objects/language';
import { Session } from 'src/data_objects/session';

@Controller('profiledeleteendpoint') 
export class ProfileDeleteEndpointController {
    @Get()
    async handleProfileDeleteRequest(@Body() deleteProfileRequest: DeleteProfileRequest): Promise<DeleteProfileResponse> {
        /*deleteProfileRequest = new DeleteProfileRequest(
            "3e8de529-977b-4b2e-8bf8-c4aa007d6202",
            new User(16, "benno.grimm@gmx.de", "updated Hash", "Updated Nickname", "Hier muss noch validated werden", "", new Date(), new Date(), "", new Region(1, "Test"), [new Game(1)], [new Language(2), new Language(3)])
        );*/

        
        // Check Session
        let session: Session = await SessionFactory.getSessionBySessionId(deleteProfileRequest.session_id);
        
        // If is invalid or doesn't belong to user, reject
        if(!session || session.user_id != deleteProfileRequest.user.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Session not authorized to delete User"
            }, HttpStatus.UNAUTHORIZED);
        }

        //Delete Session
        let successful: boolean = await SessionFactory.deleteSessionByUser(deleteProfileRequest.user);
        if (!successful) {
            console.error("ProfileDeleteEndpoint: Couldn't delete User sessions");
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to delete old User sessions"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Delete User
        let user: User = await UserFactory.deleteUser(deleteProfileRequest.user);

        if (!user) {
            console.error("ProfileDeleteEndpoint: Couldn't delete user");
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Failed to delete old User sessions"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return new DeleteProfileResponse(true, deleteProfileRequest.user);
    }
}