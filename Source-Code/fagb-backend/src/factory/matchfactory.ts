import { MatchMakingRequest } from '../data_objects/matchmakingrequest';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { GameResponse } from '../data_objects/gameresponse';
import { Game } from '../data_objects/game';
import { v4 as uuidv4 } from 'uuid';
import { UserFactory } from './userfactory';
import { QueryObject } from '../data_objects/queryobject';
import { match } from 'assert';
import { UploadedFile } from '@nestjs/common';
import { throwError } from 'rxjs';
import { User } from '../data_objects/user';
import { MatchMakingResponse } from 'src/data_objects/matchmakingresponse';
import { PublicUser } from 'src/data_objects/publicuser';
import { GameFactory } from './gamefactory';

export class MatchFactory {
    public static async createMatchMakingRequest(matchMakingRequest: MatchMakingRequest): Promise<boolean> {
        const query: QueryObject = QueryBuilder.createMatchMakingRequest(matchMakingRequest);
        let successful: boolean = false;

        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('MatchFactory createMatchMakingRequest(): Database Query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('MatchFactory createMatchMakingRequest(): Couldn\'t create MatchMakingRequest');
            return false;
        }

        // Get User to figure out Region
        const user: User = await UserFactory.getUserByUserId(matchMakingRequest.user_id);
        if (!user) {
            console.error('MatchFactory createMatchMakingRequest(): Couldn\'t get user');
            return false;
        }

        // Successfully created MatchMakingRequest
        // Now try to create a Match for that Game

        // TODO: await?
        MatchFactory.createMatch(matchMakingRequest.game_id, user.region.region_id, matchMakingRequest.casual);

        return true;
    }


    /**
     * Checks if a User has open MatchMakingRequest. Returns true if User has open MatchMakingRequest, else returns false
     * @param user_id ID of User to be checked
     */
    public static async checkOpenMatchMakingRequest(user_id: number): Promise<boolean> {
        const query: QueryObject = QueryBuilder.getOpenMatchMakingRequestByUser(user_id);
        let hasOpen: boolean = true;

        try {
            const result = (await ConnectToDatabaseService.executeQuery(query))[0];
            if (!result) {
                hasOpen = false;
            }
        } catch (e) {
            console.error('MatchFactory checkOpenMatchMakingRequest(): Database Query threw exception');
            console.error(e);
            throw new Error('Couldn\'t get Open MatchMakingRequests');
        }

        return hasOpen;
    }

    public static async createMatch(game_id: number, region_id: number, casual: boolean): Promise<void> {
        // Get Open MatchMakingRequests for Game
        const query = QueryBuilder.getOpenMatchMakingRequestsByGame(game_id, region_id, casual);
        let allRequests: MatchMakingRequest[] = [];

        try {
            const result: any[] = await ConnectToDatabaseService.executeQuery(query);
            result.forEach(request => {
                allRequests.push(new MatchMakingRequest(null, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id, request.time_stamp, request.request_id));
            });
        } catch (e) {
            console.error('MatchFactory createMatch(): Database Query threw exception');
            console.error(e);
        }

        if (!allRequests || !allRequests[0]) {
            console.error('MatchFactory createMatch(): Couldn\'t get MatchMakingRequests');
            return;
        }

        // Maybe i-- Loop?
        for (const request of allRequests) {
            let tempMatchmakingRequests: MatchMakingRequest[];
            const cloned = allRequests.map(x => Object.assign({}, x))
            tempMatchmakingRequests = MatchFactory.findMatch([request], cloned);
            if (!tempMatchmakingRequests) {
                continue;
            } else {
                allRequests = tempMatchmakingRequests;
            }
            for (let i = allRequests.length - 1; i > -1; i--) {
                if (allRequests[i].match_id) {
                    // Update Entry on Database
                    const successful: boolean = await MatchFactory.updateMatchMakingRequest(allRequests[i]);
                    if (!successful) {
                        console.error('MatchFactory createMatch(): Failed to update MatchMakingRequest');
                        return;
                    }

                    // Remove element from allRequests Array
                    // allRequests.splice(allRequests.findIndex(x => x.request_id == currentRequest.request_id), 1)
                    allRequests.splice(i, 1);
                    // console.log(allRequests);
                }
            }
        }
    }


    private static findMatch(potentialMatch: MatchMakingRequest[], allRequests: MatchMakingRequest[]): MatchMakingRequest[] {

        const targetSum: number = potentialMatch[0].players_in_party + potentialMatch[0].searching_for;

        // Remove elements in potential Match from allRequests array
        for (const request of potentialMatch) {
            const index: number = allRequests.findIndex(x => x.request_id === request.request_id)
            if (index !== -1) {
                allRequests.splice(index, 1);
            }
        }

        // Now potentialMatch contains a list of MatchMakingRequests that could be matched with a sum <= targetSum while allRequests contains all other requests

        for (const request of allRequests) {
            const currentSum: number = MatchFactory.matchPlayersCount(potentialMatch) + request.players_in_party;
            if (currentSum === targetSum && request.players_in_party + request.searching_for === targetSum) {
                // If adding request to the potentialMatch would add up the total player count to the target sum we have a match
                potentialMatch.push(request);
                allRequests.splice(allRequests.findIndex(x => x.request_id === request.request_id), 1);
                allRequests = MatchFactory.completeMatch(potentialMatch, allRequests);
                return allRequests;
            } else if (currentSum < targetSum && request.players_in_party + request.searching_for === targetSum) {
                // Add request to potential Match and continue searching
                potentialMatch.push(request);
                allRequests.splice(allRequests.findIndex(x => x.request_id === request.request_id), 1);
                return MatchFactory.findMatch(potentialMatch, allRequests);
            }
        }
        return null;
    }

    private static matchPlayersCount(requests: MatchMakingRequest[]): number {
        let sum: number = 0;
        for (const request of requests) {
            sum += request.players_in_party;
        }

        return sum;
    }


    private static completeMatch(matchedRequests: MatchMakingRequest[], otherRequests: MatchMakingRequest[]): MatchMakingRequest[] {
        const match_id: string = uuidv4();
        for (const matchedRequest of matchedRequests) {
            matchedRequest.match_id = match_id;
            otherRequests.push(matchedRequest);
        }
        // console.log("otherRequests:");
        // console.log(otherRequests);
        return otherRequests;
    }

    public static async getMatchMakingCountForGames(): Promise<GameResponse[]> {
        const query: QueryObject = QueryBuilder.getNoOfMatchMakingRequestsByGame();
        const gameResponses: GameResponse[] = [];

        try {
            const results: any[] = await ConnectToDatabaseService.executeQuery(query);
            results.forEach(result => {
                gameResponses.push(new GameResponse(new Game(result.game_id, result.name, result.cover_link, result.game_description, result.publisher, result.published), !result.players_count ? 0 : result.players_count));
            });
        } catch (e) {
            console.error('MatchFactory getMatchMakingCountForGames(): Database query threw exception');
            console.error(e);
        }

        if (!gameResponses || !gameResponses[0]) {
            console.error('MatchFactory getMatchMakingCountForGames(): Couldn\'t build GameResponses')
            return null;
        }

        return gameResponses;
    }

    private static async updateMatchMakingRequest(matchMakingRequest: MatchMakingRequest): Promise<boolean> {
        const query: QueryObject = QueryBuilder.updateMatchmakingRequest(matchMakingRequest);
        let successful: boolean = false;

        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('MatchFactory updateMatchMakingRequest(): Database query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('MatchFactory updateMatchMakingRequest(): Couldn\'t update MatchMakingRequest');
            return false;
        }

        return true;
    }

    public static async getMostRecentRequestByUser(user_id: number): Promise<MatchMakingRequest> {
        const query: QueryObject = QueryBuilder.getMostRecentRequestByUserId(user_id);
        let matchMakingRequest: MatchMakingRequest;
        try {
            const result: any = (await ConnectToDatabaseService.executeQuery(query))[0];
            // console.log(result);
            matchMakingRequest = new MatchMakingRequest(null, result.user_id, result.game_id, result.searching_for, result.players_in_party, result.casual, result.match_id, result.time_stamp, result.request_id)
        } catch (e) {
            console.error('MatchFactory getMostRecentRequestByUser(): Database query threw exception');
            console.error(e);
        }

        if (!matchMakingRequest) {
            console.error('MatchFactory getMostRecentRequestByUser(): Couldn\'t get most recent MatchMakingRequest')
            return null;
        }

        return matchMakingRequest;
    }

    /**
     * Resolves to true if a Match is found, otherwise resolves to false.
     * Rejects when an error occurs
     * @param request_id Id of the Request to be checked
     */
    // public static async checkRequestForMatch(request_id: number) {
    //     return new Promise(async function (resolve, reject) {
    //         let query = QueryBuilder.getMatchMakingRequestByRequestId(request_id);
    //         let result;
    //         await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
    //             result = callbackValue;
    //         }, function (callbackValue) {
    //             console.error("MatchFactory checkRequestForMatch(): Couldn't get MatchMakingRequest from Database");
    //             reject(callbackValue);
    //             return;
    //         });

    //         if(!result) {
    //             reject("MatchFactory checkRequestForMatch(): No MatchMakingRequest with that ID: " + request_id)
    //             return;
    //         }

    //         if(!result.match_id) {
    //             resolve(null);
    //             return;
    //         }

    //         // resolve(true)

    //         resolve(new MatchMakingRequest(result.session_id, result.user_id, result.game_id, result.searching_for, result.players_in_party, result.casual, result.match_id, result.time_stamp, result.request_id))

    //     });
    // }

    public static async getMatchMakingRequestsByMatchId(match_id: string): Promise<MatchMakingRequest[]> {
        const query: QueryObject = QueryBuilder.getMatchMakingRequestsByMatchId(match_id);
        const matchMakingRequests: MatchMakingRequest[] = [];
        try {
            const result: any[] = await ConnectToDatabaseService.executeQuery(query);
            result.forEach(request => {
                // console.log(query);
                matchMakingRequests.push(
                    new MatchMakingRequest(request.session_id, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id, request.time_stamp, request.request_id));
            });
        } catch (e) {
            console.error('MatchFactory getMatchMakingRequestsByMatchId(): Database query threw exception');
            console.error(e);
        }

        if (!matchMakingRequests || !matchMakingRequests[0] || !matchMakingRequests[1]) {
            console.error('MatchFactory getMatchMakingRequestsByMatchId(): Couldn\'t get MatchMakingRequests');
            // console.log(matchMakingRequests);
            return null;
        }

        return matchMakingRequests;

        // Check if we got an result containing at least to Elements (at least two are needed for a match)
        // if (!result || !result[0] || !result[1]) {
        //     console.log(result);
        //     console.error("MatchFactory getMatchMakingRequestsByMatchId(): Impossible result");
        //     reject(false);
        //     return;
        // }


        // for (let request of result) {
        //     matchMakingRequests.push(new MatchMakingRequest(request.session_id, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id, request.time_stamp, request.request_id));
        // }

    }

    public static async getMatchMakingRequestByRequestId(request_id: number): Promise<MatchMakingRequest> {
        const query: QueryObject = QueryBuilder.getMatchMakingRequestByRequestId(request_id);
        let matchMakingRequest: MatchMakingRequest;
        try {
            const result: any = (await ConnectToDatabaseService.executeQuery(query))[0];
            matchMakingRequest = new MatchMakingRequest(null, result.user_id, result.game_id, result.searching_for, result.players_in_party, result.casual, result.match_id, result.time_stamp, result.request_id);
        } catch (e) {
            console.error('MatchFactory getMatchMakingRequestsByMatchId(): Database query threw exception');
            console.error(e);
        }

        if (!matchMakingRequest) {
            console.error('MatchFactory checkRequestForMatch(): Couldn\'t get MatchMakingRequest from Database');
            return null;
        }

        return matchMakingRequest;
    }

    public static async deleteMatchMakingRequest(request_id: number): Promise<boolean> {
        const query: QueryObject = QueryBuilder.deleteMatchMakingRequest(request_id);
        let successful: boolean = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('MatchFactory getMatchMakingRequestsByMatchId(): Database query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('MatchFactory getMatchMakingRequestsByMatchId(): Failed to delete MatchMakingRequest');
            return false;
        }

        return true;
    }

    public static async getMatchHistory(publicUser: PublicUser, first: number, next: number): Promise<MatchMakingResponse[]> {
        let query: QueryObject = QueryBuilder.matchHistoryWithPaging(publicUser.user_id, first, next);
        let result: any[] = await ConnectToDatabaseService.executeQuery(query);

        if (!result) {
            return null;
        }

        // console.log(result);

        let history: MatchMakingResponse[] = [];
        for(let request of result) {
            history.push(await MatchFactory.matchToMatchMakingResponse(publicUser, new MatchMakingRequest(null, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id.toString(), request.time_stamp, request.request_id)));
        }
        // console.log(history);

        return history;
    }

    public static async matchToMatchMakingResponse(publicUser: PublicUser, matchMakingRequest: MatchMakingRequest): Promise<MatchMakingResponse> {
        // console.log(matchMakingRequest);
        let response: MatchMakingResponse = new MatchMakingResponse(publicUser, null, matchMakingRequest, null);

        // Game
        response.game = await GameFactory.getGameById(matchMakingRequest.game_id);

        // Matched User
        let matchedRequests: MatchMakingRequest[] = await MatchFactory.getMatchMakingRequestsByMatchId(matchMakingRequest.match_id);
        let matchedUsers: PublicUser[] = [];
        // console.log(matchedRequests);
        for (let request of matchedRequests) {
            if (request.user_id != publicUser.user_id) {
                // console.log(request.user_id);
                let tempUser: User = await UserFactory.getUserByUserId(request.user_id);
                // console.log(tempUser);
                matchedUsers.push(await UserFactory.userToPublicUser(tempUser));
                // matchedUsers.push(null);
            }
        }

        response.matchedUsers = matchedUsers;
        // console.log(response);

        return response;
    }

    public static async getNumberOfMatchedRequestsByUser(user_id: number): Promise<number> {
        const query: QueryObject = QueryBuilder.getNumberOfMatchedRequestsByUser(user_id);
        let result: any = (await ConnectToDatabaseService.executeQuery(query))[0];
        if (!result) {
            return 0;
        } else {
            return result.amount;
        }
    }
}