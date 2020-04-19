import { Controller, HttpException, HttpStatus, Body, Get, Post } from '@nestjs/common';
import { MatchHistoryRequest } from 'src/data_objects/matchhistoryrequest';
import { MatchHistoryResponse } from 'src/data_objects/matchhistoryresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { Session } from 'src/data_objects/session';
import { MatchFactory } from 'src/factory/matchfactory';
import { PublicUser } from 'src/data_objects/publicuser';
import { UserFactory } from 'src/factory/userfactory';
import { MatchMakingResponse } from 'src/data_objects/matchmakingresponse';

@Controller('match-history')
export class MatchHistoryController {

    @Post()
    public async getMatchHistory(@Body() matchHistoryRequest: MatchHistoryRequest): Promise<MatchHistoryResponse> {

        matchHistoryRequest = new MatchHistoryRequest("c943e748-9c53-4f9b-bbc8-690a4813bf81", 201, 0, 10);
        // Validate Request
        // Get Session by Session Id
        const session: Session = await SessionFactory.getSessionBySessionId(matchHistoryRequest.session_id);
        if(matchHistoryRequest.user_id != session.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Unauthorized to access this content"
            }, HttpStatus.UNAUTHORIZED);
        }

        // Get Public User
        const publicUser: PublicUser = await UserFactory.userToPublicUser(await UserFactory.getUserByUserId(session.user_id));
        let history: MatchMakingResponse[];

        // Get MatchHistory without Paging
        if(matchHistoryRequest.first == null || matchHistoryRequest.next == null) {
            // Return whole history
            history = await MatchFactory.getMatchHistory(publicUser, 0, 10);
        } else {
            // User Paging
            history = await MatchFactory.getMatchHistory(publicUser, matchHistoryRequest.first, matchHistoryRequest.next);
        }

        if(!history) {
            return new MatchHistoryResponse(publicUser, 0, null);
        }

        return new MatchHistoryResponse(publicUser, await MatchFactory.getNumberOfMatchedRequestsByUser(publicUser.user_id), history);

    }
}
