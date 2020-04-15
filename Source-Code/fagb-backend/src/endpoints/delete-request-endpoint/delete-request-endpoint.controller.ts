import { Controller, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteMatchMakingRequest } from 'src/data_objects/deletematchmakingrequest';
import { SessionFactory } from 'src/factory/sessionfactory';
import { MatchFactory } from 'src/factory/matchfactory';
import { match } from 'assert';
import { MatchMakingRequest } from 'src/data_objects/matchmakingrequest';
import { ConnectToDatabaseService } from 'src/connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { Language } from 'src/data_objects/language';
import { LanguageFactory } from 'src/factory/languagefactory';
import { UserFactory } from 'src/factory/userfactory';
import { Session } from 'src/data_objects/session';

@Controller('deleterequestendpoint')
export class DeleteRequestEndpointController {
    @Get()
    public async testMatchMaking() {
        // let matchMakingRequest = new MatchMakingRequest(null, 9, 1, 1, 1, true);

        // await MatchFactory.createMatchMakingRequest(matchMakingRequest);

        // return await UserFactory.getUserByEmail("mrsbody@sex190.com");
        // let result;
        // try {
        //     result = await ConnectToDatabaseService.executeQuery(QueryBuilder.getNoOfMatchMakingRequestsByGame());
        //     // console.log(result)
        // } catch(e) {
        //     console.error(e);
        //     throw new HttpException({
        //         status: HttpStatus.INTERNAL_SERVER_ERROR,
        //         error: "Something went wrong"
        //     }, HttpStatus.INTERNAL_SERVER_ERROR)
        // }
        // return result;

        // matchMakingRequest = null;
        // await MatchFactory.getMatchMakingRequestByRequestId(notifyMatch.request_id).then(function(callbackValue) {
        //     matchMakingRequest = callbackValue;
        // }, function(callbackValue) {
        //     console.error("NotifymatchendpointController handleUpdate(): ");
        //     console.error(callbackValue);

        // });
    }


    @Get()
    public async handleDeleteRequest(@Body() deleteRequest: DeleteMatchMakingRequest) {
        // Check if Session authorizes to delete request
        let session: Session = await SessionFactory.getSessionBySessionId(deleteRequest.session_id);

        // Second get MatchMakingRequest
        let matchMakingRequest: MatchMakingRequest= await MatchFactory.getMatchMakingRequestByRequestId(deleteRequest.request_id);

        if (!session || ! matchMakingRequest || session.user_id != matchMakingRequest.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Not authorized to delete request"
            }, HttpStatus.UNAUTHORIZED);
        }

        // If MatchMakingRequest is already matched, don't delete
        if(!(!matchMakingRequest.match_id || !matchMakingRequest.match_id.toString() || matchMakingRequest.match_id.toString() == "" || Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]).toString() == matchMakingRequest.match_id.toString())) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "Can't delete already matched request"
            }, HttpStatus.NOT_ACCEPTABLE)
        }

        // Delete 
        if(!(await MatchFactory.deleteMatchMakingRequest(deleteRequest.request_id))) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Couldn't delete MatchMakingRequest"
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return true;
    }
}
