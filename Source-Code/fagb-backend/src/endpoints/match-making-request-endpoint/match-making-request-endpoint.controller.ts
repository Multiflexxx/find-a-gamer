import { Controller, Get, Body } from '@nestjs/common';
import { MatchMakingRequest } from 'src/data_objects/matchmakingrequest';
import { SessionFactory } from 'src/factory/sessionfactory';
import { GameFactory } from 'src/factory/gamefactory';
import { Response } from 'src/data_objects/response';

@Controller('matchmakingrequestendpoint')
export class MatchMakingRequestEndpointController {
    @Get()
    public async requestMatch(@Body() matchmakingRequest: MatchMakingRequest) {
        // Check if Session is valid for User
        let session;
        await SessionFactory.getSessionBySessionId(matchmakingRequest.session_id).then(function(callbackValue) {
            session = callbackValue;
        }, function(callbackValue) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't get Session for user");
            console.error(callbackValue);
        });

        if(!session || session.user_id != matchmakingRequest.user_id) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Session is Null or User in Session doesn't Match User");
            return new Response(false, "Something went wrong completing your request");
        }

        // Check if Game exists
        let game;
        await GameFactory.getGameById(matchmakingRequest.game_id).then(function(callbackValue) {
            game = callbackValue;
        }, function(callbackValue) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't get Game");
            console.error(callbackValue);
        });

        if(!game) {
            console.error("MatchMakingRequestEndpointController requestMatch(): GameFactory getGameById() returned null");
            return new Response(false, "Something went wrong completing your request");
        }

        // Create MatchmakingRequest on Database
        return new Response(true, "Something went wrong completing your request");
    }
}
