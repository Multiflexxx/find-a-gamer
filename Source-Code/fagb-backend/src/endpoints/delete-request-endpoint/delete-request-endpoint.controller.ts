import { Controller, Get, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { DeleteMatchMakingRequest } from '../../data_objects/deletematchmakingrequest';
import { SessionFactory } from '../../factory/sessionfactory';
import { MatchFactory } from '../../factory/matchfactory';
import { match } from 'assert';
import { MatchMakingRequest } from '../../data_objects/matchmakingrequest';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import { Language } from '../../data_objects/language';
import { LanguageFactory } from '../../factory/languagefactory';
import { UserFactory } from '../../factory/userfactory';
import { Session } from '../../data_objects/session';
import { DeleteMatchMakingResponse } from '../../data_objects/deletematchmakingresponse';

@Controller('deleterequestendpoint')
export class DeleteRequestEndpointController {

    @Post()
    public async handleDeleteRequest(@Body() deleteRequest: DeleteMatchMakingRequest): Promise<DeleteMatchMakingResponse> {
        // Check if Session authorizes to delete request
        const session: Session = await SessionFactory.getSessionBySessionId(deleteRequest.session_id);

        // Second get MatchMakingRequest
        const matchMakingRequest: MatchMakingRequest= await MatchFactory.getMatchMakingRequestByRequestId(deleteRequest.request_id);

        if (!session || ! matchMakingRequest || session.user_id !== matchMakingRequest.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: 'Not authorized to delete request'
            }, HttpStatus.UNAUTHORIZED);
        }

        // If MatchMakingRequest is already matched, don't delete
        const compBuffer: Buffer = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        if(!(!matchMakingRequest.match_id || !matchMakingRequest.match_id.toString() || matchMakingRequest.match_id.toString() === '' || compBuffer.toString() === matchMakingRequest.match_id.toString())) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Can\'t delete already matched request'
            }, HttpStatus.NOT_ACCEPTABLE)
        }

        // Delete
        if(!(await MatchFactory.deleteMatchMakingRequest(deleteRequest.request_id))) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t delete MatchMakingRequest'
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return new DeleteMatchMakingResponse(true, matchMakingRequest);
    }
}
