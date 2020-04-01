import { MatchMakingRequest } from "../data_objects/matchmakingrequest";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";
import { GameResponse } from "../data_objects/gameresponse";
import { Game } from "../data_objects/game";
import { v4 as uuidv4 } from 'uuid';
import { UserFactory } from "./userfactory";

export class MatchFactory {
    public static async createMatchMakingRequest(matchMakingRequest: MatchMakingRequest) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.createMatchMakingRequest(matchMakingRequest);
            let successful;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                successful = true;
            }, function (callbackValue) {
                console.error("MatchFactory createMatchMakingRequest(): Couldn't create MatchMakingRequest");
                console.error(callbackValue);
            });

            if (!successful) {
                reject(false);
                return;
            }

            resolve(true)

            // Get User to figure out Region
            let result;
            await UserFactory.getUserByUserId(matchMakingRequest.user_id).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("MatchFactory createMatchMakingRequest(): Couldn't get user");
                console.error(callbackValue);
            });

            if (!result) {
                console.error("MatchFactory createMatchMakingRequest(): Result null");
            }

            // Successfully created MatchMakingRequest
            // Now try to create a Match for that Game

            MatchFactory.createMatch(matchMakingRequest.game_id, result.region_id, matchMakingRequest.casual);
        });
    }


    /**
     * Checks if a User has open MatchMakingRequest. Returns true if User has open MatchMakingRequest, else returns false
     * @param user_id ID of User to be checked
     */
    public static async checkOpenMatchMakingRequest(user_id: number) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getOpenMatchMakingRequestByUser(user_id);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("MatchFactory checkOpenMatchMakingRequest(): Couldn't get Open MatchMakingRequests");
                reject(callbackValue);
            });

            if (!result) {
                resolve(false);
                return;
            }

            resolve(true);
        })

    }

    public static async createMatch(game_id: number, region_id: number, casual: boolean) {
        // Get Open MatchMakingRequests for Game
        let query = QueryBuilder.getOpenMatchMakingRequestsByGame(game_id, region_id, casual);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            result = callbackValue;
        }, function (callbackValue) {
            console.error("MatchFactory createMatch(): Couldn't get MatchMakingRequests");
            console.error(callbackValue);
        });

        if (!result || !result[0]) {
            console.error("MatchFactory createMatch(): Result null or no MatchMakingRequests for Game: " + game_id);
        }

        // Transform Results into MatchMakingRequest Objects
        let allRequests: MatchMakingRequest[] = [];
        for (let request of result) {
            allRequests.push(new MatchMakingRequest(null, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id, request.time_stamp, request.request_id));
        }

        // Maybe i-- Loop?
        for (let request of allRequests) {
            let tempMatchmakingRequests: MatchMakingRequest[];
            let cloned = allRequests.map(x => Object.assign({}, x))
            tempMatchmakingRequests = MatchFactory.findMatch([request], cloned);
            if (!tempMatchmakingRequests) {
                continue;
            } else {
                allRequests = tempMatchmakingRequests;
            }
            for (let i = allRequests.length - 1; i > -1; i--) {
                if (allRequests[i].match_id) {
                    // Update Entry on Database
                    let successful;
                    await MatchFactory.updateMatchMakingRequest(allRequests[i]).then(function (callbackValue) {
                        successful = true;
                    }, function (callbackValue) {
                        console.error("MatchFactory createMatch(): Failed to update MatchMakingRequest");
                        console.error(callbackValue);
                    });

                    if (!successful) {
                        return;
                    }

                    // Remove element from allRequests Array
                    // allRequests.splice(allRequests.findIndex(x => x.request_id == currentRequest.request_id), 1)
                    allRequests.splice(i, 1);
                    console.log(allRequests);
                }
            }
        }
    }


    private static findMatch(potentialMatch: MatchMakingRequest[], allRequests: MatchMakingRequest[]): MatchMakingRequest[] {

        let targetSum: number = potentialMatch[0].players_in_party + potentialMatch[0].searching_for;

        // Remove elements in potential Match from allRequests array
        for (let request of potentialMatch) {
            let index: number = allRequests.findIndex(x => x.request_id == request.request_id)
            if (index != -1) {
                allRequests.splice(index, 1);
            }
        }

        // Now potentialMatch contains a list of MatchMakingRequests that could be matched with a sum <= targetSum while allRequests contains all other requests

        for (let request of allRequests) {
            let currentSum: number = MatchFactory.matchPlayersCount(potentialMatch) + request.players_in_party;
            if (currentSum == targetSum && request.players_in_party + request.searching_for === targetSum) {
                // If adding request to the potentialMatch would add up the total player count to the target sum we have a match
                potentialMatch.push(request);
                allRequests.splice(allRequests.findIndex(x => x.request_id == request.request_id), 1);
                allRequests = MatchFactory.completeMatch(potentialMatch, allRequests);
                return allRequests;
            } else if (currentSum < targetSum && request.players_in_party + request.searching_for === targetSum) {
                // Add request to potential Match and continue searching
                potentialMatch.push(request);
                allRequests.splice(allRequests.findIndex(x => x.request_id == request.request_id), 1);
                return MatchFactory.findMatch(potentialMatch, allRequests);
            }
        }
        return null;
    }

    private static matchPlayersCount(requests: MatchMakingRequest[]) {
        let sum: number = 0;
        for (let request of requests) {
            sum += request.players_in_party;
        }

        return sum;
    }


    private static completeMatch(matchedRequests: MatchMakingRequest[], otherRequests: MatchMakingRequest[]): MatchMakingRequest[] {
        let match_id: string = uuidv4();
        for (let matchedRequest of matchedRequests) {
            matchedRequest.match_id = match_id;
            otherRequests.push(matchedRequest);
        }
        // console.log("otherRequests:");
        // console.log(otherRequests);
        return otherRequests;
    }

    public static async getMatchMakingCountForGames() {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getNoOfMatchMakingRequestsByGame();
            let results;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                results = callbackValue;
            }, function (callbackValue) {
                console.error("MatchFactory getMatchMakingCountForGames(): Couldn't get ")
                reject(callbackValue);
            });

            if (!results) {
                reject(false);
                return;
            }
            let gameResponses: GameResponse[] = [];
            for (let result of results) {
                gameResponses.push(new GameResponse(new Game(result.game_id, result.name, result.cover_link, result.game_description, result.publisher, result.published), !result.players_searching ? 0 : result.players_searching));
            }
            resolve(gameResponses);
        });
    }

    private static async updateMatchMakingRequest(matchMakingRequest: MatchMakingRequest) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.updateMatchmakingRequest(matchMakingRequest);
            let successful;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                successful = true;
            }, function (callbackValue) {
                console.error("MatchFactory updateMatchMakingRequest(): Couldn't update MatchMakingRequest");
                reject(callbackValue);
                return;
            });

            if (!successful) {
                console.error("MatchFactory updateMatchMakingRequest(): Couldn't update MatchMakingRequest");
                reject(false);
                return
            }

            resolve(true);
        });
    }

    public static async getMostRecentRequestByUser(user_id: number) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getMostRecentRequestByUserId(user_id);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("MatchFactory getMostRecentRequestByUser(): Couldn't get most recent MatchMakingRequest");
                reject(callbackValue);
            });

            if (!result || result.length > 1) {
                console.error("MatchFactory getMostRecentRequestByUser(): Result is null or multiple open Requests exist for User");
                reject(false);
                return;
            }

            resolve(new MatchMakingRequest(null, result[0].user_id, result[0].game_id, result[0].searching_for, result[0].players_in_party, result[0].casual, result[0].match_id, result[0].time_stamp, result[0].request_id));
        });

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

    public static async getMatchMakingRequestsByMatchId(match_id) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getMatchMakingRequestsByMatchId(match_id);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("MatchFactory getMatchMakingRequestsByMatchId(): Couldn't get MatchMakingRequests");
                reject(callbackValue);
            });

            // Check if we got an result containing at least to Elements (at least two are needed for a match)
            if (!result || !result[0] || !result[1]) {
                console.error("MatchFactory getMatchMakingRequestsByMatchId(): Impossible result");
                reject(false);
                return;
            }

            let matchMakingRequests: MatchMakingRequest[] = [];
            for (let request of result) {
                matchMakingRequests.push(new MatchMakingRequest(request.session_id, request.user_id, request.game_id, request.searching_for, request.players_in_party, request.casual, request.match_id, request.time_stamp, request.request_id));
            }

            resolve(matchMakingRequests);
        });
    }

    public static async getMatchMakingRequestByRequestId(request_id: number) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getMatchMakingRequestByRequestId(request_id);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("MatchFactory checkRequestForMatch(): Couldn't get MatchMakingRequest from Database");
                reject(callbackValue);
                return;
            });

            if (!result) {
                reject("MatchFactory checkRequestForMatch(): No MatchMakingRequest with that ID: " + request_id)
                return;
            }

            resolve(new MatchMakingRequest(result.session_id, result.user_id, result.game_id, result.searching_for, result.players_in_party, result.casual, result.match_id, result.time_stamp, result.request_id))

        });
    }
}