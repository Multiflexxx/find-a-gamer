import { Controller, HttpException, HttpStatus } from '@nestjs/common';
import { MatchHistoryRequest } from 'src/data_objects/matchhistoryrequest';
import { MatchHistoryResponse } from 'src/data_objects/matchhistoryresponse';
import { SessionFactory } from 'src/factory/sessionfactory';
import { Session } from 'src/data_objects/session';

@Controller('match-history')
export class MatchHistoryController {
    public async getMatchHistory(matchHistoryRequest: MatchHistoryRequest): Promise<MatchHistoryResponse> {
        // Validate Request
        // Get Session by Session Id
        const session: Session = await SessionFactory.getSessionBySessionId(matchHistoryRequest.session_id);
        if(matchHistoryRequest.user_id != session.user_id) {
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Unauthorized to access this content"
            }, HttpStatus.UNAUTHORIZED);
        }

        // Get MatchHistory without Paging
        if(matchHistoryRequest.first == null || matchHistoryRequest.next == null) {
            // Return whole history

        } else {
            // User Paging
        }

    }
}
