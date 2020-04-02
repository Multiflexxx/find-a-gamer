import { Controller, Get, Body, HttpException, HttpStatus, Post } from '@nestjs/common';
import { MatchMakingRequest } from '../../data_objects/matchmakingrequest';
import { SessionFactory } from '../../factory/sessionfactory';
import { GameFactory } from '../../factory/gamefactory';
import { Response } from '../../data_objects/response';
import { MatchFactory } from '../../factory/matchfactory';
import { MatchMakingResponse } from '../../data_objects/matchmakingresponse';

@Controller('matchmakingrequestendpoint')
export class MatchMakingRequestEndpointController {
    @Post()
    public async requestMatch(@Body() matchmakingRequest: MatchMakingRequest) {

        // MatchFactory.createMatch(1);
        // matchmakingRequest = new MatchMakingRequest("b9117c5e-8c9e-4e5e-be97-717677c8ecfd", 2, 1, 1, 1, true, null);
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
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t create Matchmaking Request',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Check if User still has open MatchMakingRequest
        let hasOpenRequests;
        await MatchFactory.checkOpenMatchMakingRequest(matchmakingRequest.user_id).then(function(callbackValue) {
            hasOpenRequests = callbackValue;
        }, function(callbackValue) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t check for open Matchmaking Requests',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        });

        if(hasOpenRequests) {
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: 'User already has open Matchmaking Request',
            }, HttpStatus.CONFLICT);
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
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t create Matchmaking Request',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Create MatchmakingRequest on Database
        let successful;
        await MatchFactory.createMatchMakingRequest(matchmakingRequest).then(function(callbackValue) {
            successful = true;
        }, function(callbackValue) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't create MatchMakingRequest");
            console.error(callbackValue);
        });

        if(!successful) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't create MatchMakingRequest");
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t create Matchmaking Request',
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // Get the created Request
        let request;
        await MatchFactory.getMostRecentRequestByUser(matchmakingRequest.user_id).then(function(callbackValue) {
            request = callbackValue;
        }, function(callbackValue) {
           console.error("MatchMakingRequestEndpointController requestMatch(): Couldn't get created request");
        });

        if(!request) {
            console.error("MatchMakingRequestEndpointController requestMatch(): request is null");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Couldn\'t get created Request',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Get Game Object for that Request
        game = null;
        await GameFactory.getGameById(request.game_id).then(function(callbackValue) {
            game = callbackValue;
        }, function(callbackValue) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Game is null");
            console.error(callbackValue);
        });

        if (!game) {
            console.error("MatchMakingRequestEndpointController requestMatch(): Game with Id: " + request.game_id + " is null")
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Couldn\'t create MatchMakingRequest',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        return new MatchMakingResponse(request, game);
    }
}
