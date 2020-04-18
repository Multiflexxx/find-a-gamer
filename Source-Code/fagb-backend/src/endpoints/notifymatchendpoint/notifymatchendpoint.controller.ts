import { Controller, Post, Get, Body, HttpException, HttpStatus, UseFilters } from '@nestjs/common';
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
import { MatchMakingResponse } from '../../data_objects/matchmakingresponse';
import { GameFactory } from '../../factory/gamefactory';
import { PublicUser } from '../../data_objects/publicuser';
import { Game } from '../../data_objects/game';
import { MatchMakingRequest } from '../../data_objects/matchmakingrequest';

@Controller('notifymatchendpoint')
export class NotifymatchendpointController {

    @Post()
    public async handleUpdate(@Body() notifyMatch: NotifyMatch): Promise<MatchMakingResponse> {

        // Check whether matchMakingRequest has a match
        const matchMakingRequest: MatchMakingRequest = await MatchFactory.getMatchMakingRequestByRequestId(notifyMatch.request_id);

        if(!matchMakingRequest) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'No MatchMakingRequest with that ID'
            }, HttpStatus.NOT_ACCEPTABLE);
        }


        // Get Game for MatchMakingRequest
        const game: Game = await GameFactory.getGameById(matchMakingRequest.game_id);
        if(!game) {
            console.error('NotifymatchendpointController handleUpdate(): Game is null');
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'No Game with that ID'
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        const publicUser: PublicUser = await UserFactory.userToPublicUser(await UserFactory.getUserByUserId(matchMakingRequest.user_id));


        // Don't question it
        //
        //
        // okay you wanna know?
        // UUIDs are stored as binary on the database. Performing BIN_TO_UUID on null fields to convert to string returns the same buffer that Buffer.from([...]) returns, which apparently isn't the same as a null buffer
        // Until now it's the only possibility we have found to check if the ID is null
        const compBuffer: Buffer = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
        if(!matchMakingRequest.match_id || !matchMakingRequest.match_id.toString() || matchMakingRequest.match_id.toString() === '' || compBuffer.toString() === matchMakingRequest.match_id.toString()) {
            return new MatchMakingResponse(publicUser, game, matchMakingRequest);
        }



        const matches: MatchMakingRequest[] = await MatchFactory.getMatchMakingRequestsByMatchId(matchMakingRequest.match_id);
        if(!matches || !matches[0] || !matches[1]) {
            console.error('NotifymatchendpointController handleUpdate(): Match is null or contains to few elements');
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: 'Match Process failed'
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Create User Array from Matches
        const matchedUsers: PublicUser[] = [];
        matches.forEach(async match => {
            if(match.user_id != matchMakingRequest.user_id) {
                matchedUsers.push(UserFactory.userToPublicUser(await UserFactory.getUserByUserId(match.user_id)));
                if(!matchedUsers[matchedUsers.length]) {
                    console.error('NotifymatchendpointController handleUpdate(): user is null');
                    throw new HttpException({
                        status: HttpStatus.NOT_ACCEPTABLE,
                        error: 'Matched user doesn\'t exist'
                    }, HttpStatus.NOT_ACCEPTABLE);
                }
            }
        });


        // console.log(matchMakingRequest);
        // console.log(game);
        // console.log(users);

        return new MatchMakingResponse(publicUser, game, matchMakingRequest, matchedUsers);
    }
}
