import { Controller, Post, Get, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotifyMatch } from '../../data_objects/notifymatch';
import { ConnectToDatabaseService } from '../../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../../connecttodatabase/querybuilder';
import { User } from '../../data_objects/user';
import { Region } from '../../data_objects/region';
import { UserFactory } from '../../factory/userfactory';
import { v4 as uuidv4 } from 'uuid';
import { QueryObject } from '../../data_objects/queryobject';
import { SessionFactory } from '../../factory/sessionfactory';
import { MatchFactory } from '../../factory/matchfactory';
import { match } from 'assert';
import { MatchMakingResponse } from '../../data_objects/matchmakingresponse';
import { GameFactory } from '../../factory/gamefactory';
import { PublicUser } from '../../data_objects/publicuser';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    @Post()
    async handleUpdate(@Body() notifyMatch: NotifyMatch) {

        // Check whether matchMakingRequest has a match
        let matchMakingRequest;
        await MatchFactory.getMatchMakingRequestByRequestId(notifyMatch.request_id).then(function(callbackValue) {
            matchMakingRequest = callbackValue;
        }, function(callbackValue) {
            console.error("NotifymatchendpointController handleUpdate(): ");
            console.error(callbackValue);

        });

        console.log("ToString");
        console.log(matchMakingRequest.match_id.toString());

        if(!matchMakingRequest) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "No MatchMakingRequest with that ID"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Get Game for MatchMakingRequest
        let game;
        await GameFactory.getGameById(matchMakingRequest.game_id).then(function(callbackValue) {
            game = callbackValue;
        }, function(callbackValue) {
            console.error("NotifymatchendpointController handleUpdate():")
            console.error(callbackValue);
        })

        if(!game) {
            console.error("NotifymatchendpointController handleUpdate(): Game is null");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "No Game with that ID"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        if(!matchMakingRequest.match_id || !matchMakingRequest.match_id.toString() || matchMakingRequest.match_id.toString() == "") {
            return new MatchMakingResponse(matchMakingRequest, game);
        }

        let matches;
        console.log("MatchMaking Request in Endpoint");
        console.log(matchMakingRequest);
        await MatchFactory.getMatchMakingRequestsByMatchId(matchMakingRequest.match_id).then(function(callbackValue) {
            matches = callbackValue;
        }, function(callbackValue) {
            console.error("NotifymatchendpointController handleUpdate(): Couldn't get Matches for Request");
            console.error(callbackValue);
        });

        if(!matches || !matches[0] || !matches[1]) {
            console.error("NotifymatchendpointController handleUpdate(): Match is null or contains to few elements");
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "Match Process failed"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Create User Array from Matches
        let users: PublicUser[] = [];
        for(let match of matches) {
            let user;
            await UserFactory.getUserByUserId(match.user_id).then(function(callbackValue) {
                user = callbackValue;
            }, function(callbackValue) {
                console.error("NotifymatchendpointController handleUpdate(): User with that ID: " + match.user_id);
                console.error(callbackValue);
            });

            if(!user) {
                console.error("NotifymatchendpointController handleUpdate(): user is null");
                throw new HttpException({
                    status: HttpStatus.NOT_ACCEPTABLE,
                    error: "Matched user doesn't exist"
                }, HttpStatus.NOT_ACCEPTABLE)
            }

            users.push(UserFactory.userToPublicUser(user));
        }

        return new MatchMakingResponse(matchMakingRequest, game, users);

    }
}
