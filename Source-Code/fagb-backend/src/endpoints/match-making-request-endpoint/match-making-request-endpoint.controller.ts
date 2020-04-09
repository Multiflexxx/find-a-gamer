import { Controller, Get, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MatchMakingRequest } from '../../data_objects/matchmakingrequest';
import { SessionFactory } from '../../factory/sessionfactory';
import { GameFactory } from '../../factory/gamefactory';
import { Response } from '../../data_objects/response';
import { MatchFactory } from '../../factory/matchfactory';
import { MatchMakingResponse } from '../../data_objects/matchmakingresponse';
import { Game } from 'src/data_objects/game';
import { Session } from 'src/data_objects/session';

@Controller('matchmakingrequestendpoint')
export class MatchMakingRequestEndpointController {
    @Post()
    public async requestMatch(@Body() matchmakingRequest: MatchMakingRequest) {

        // MatchFactory.createMatch(1);
        // matchmakingRequest = new MatchMakingRequest("b9117c5e-8c9e-4e5e-be97-717677c8ecfd", 2, 1, 1, 1, true, null);
        // Check if Session is valid for User
        let session: Session = await SessionFactory.getSessionBySessionId(matchmakingRequest.session_id);
        if(!session || session.user_id != matchmakingRequest.user_id) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Session is Null or User in Session doesn't Match User");
            throw new HttpException({
                status: HttpStatus.UNAUTHORIZED,
                error: "Session not authorized to create Request for User",
            }, HttpStatus.UNAUTHORIZED);
        }

        // Check if User still has open MatchMakingRequest
        let hasOpenRequests: boolean = true;
        try {
            hasOpenRequests = await MatchFactory.checkOpenMatchMakingRequest(matchmakingRequest.user_id);
        } catch(e) {
            console.error(e);
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t check for open Matchmaking Requests',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if(hasOpenRequests) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User already has open Matchmaking Request',
            }, HttpStatus.CONFLICT);
        }

        // Check if Game exists
        let game: Game = await GameFactory.getGameById(matchmakingRequest.game_id);
        if(!game) {
            console.error("MatchMakingRequestEndpointController requestMatch(): GameFactory getGameById() returned null");
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t create Matchmaking Request',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Create MatchmakingRequest on Database
        let successful: boolean = await MatchFactory.createMatchMakingRequest(matchmakingRequest);
        if(!successful) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't create MatchMakingRequest");
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t create Matchmaking Request',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Get the created Request
        let request: MatchMakingRequest = await MatchFactory.getMostRecentRequestByUser(matchmakingRequest.user_id);
        if(!request) {
            console.error("MatchMakingRequestEndpointController requestMatch(): request is null");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Couldn\'t get created Request',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        return new MatchMakingResponse(request, game);
    }
}
