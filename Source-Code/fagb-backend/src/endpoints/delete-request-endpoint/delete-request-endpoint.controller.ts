import { Controller, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { DeleteMatchMakingRequest } from 'src/data_objects/deletematchmakingrequest';
import { SessionFactory } from 'src/factory/sessionfactory';
import { MatchFactory } from 'src/factory/matchfactory';
import { match } from 'assert';

@Controller('deleterequestendpoint')
export class DeleteRequestEndpointController {
    @Get()
    public async handleDeleteRequest(@Body() deleteRequest: DeleteMatchMakingRequest) {
        // Check if Session authorizes to delete request
        // First get Session Object
        let session;
        await SessionFactory.getSessionBySessionId(deleteRequest.session_id).then(function (callbackValue) {
            session = callbackValue;
        }, function (callbackValue) {
            console.error("DeleteRequestEndpointController handleDeleteRequest(): Couldn't get Session with ID: " + deleteRequest.session_id);
            console.error(callbackValue);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Couldn't get Session"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if (!session) {
            console.error("DeleteRequestEndpointController handleDeleteRequest(): Session is null");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "No such Session"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Second get MatchMakingRequest
        let matchMakingRequest;
        await MatchFactory.getMatchMakingRequestByRequestId(deleteRequest.request_id).then(function(callbackValue) {
            matchMakingRequest = callbackValue;
        }, function(callbackValue) {
            console.error("DeleteRequestEndpointController handleDeleteRequest(): Couldn't get MatchMakingRequest with ID: " + deleteRequest.request_id);
            console.error(callbackValue);
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "No such MatchMakingRequest"
            }, HttpStatus.NOT_ACCEPTABLE)
        });

        if(!matchMakingRequest) {
            console.error("DeleteRequestEndpointController handleDeleteRequest(): matchMakingRequest is null");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "No such matchMakingRequest"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Check if Session authorizes user to delete particular MatchMakingRequest
        if(matchMakingRequest.user_id != session.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Session doesn't match User of MatchMakingRequest"
            }, HttpStatus.UNAUTHORIZED)
        }

        // If MatchMakingRequest is already matched, don't delete
        if(!!matchMakingRequest.match_id) {
            
        }

        // Delete 

    }
}
