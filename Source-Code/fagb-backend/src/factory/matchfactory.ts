import { MatchMakingRequest } from "src/data_objects/matchmakingrequest";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { GameResponse } from "src/data_objects/gameresponse";
import { Game } from "src/data_objects/game";

export class MatchFactory {
    public static async createMatchMakingRequest(matchMakingRequest: MatchMakingRequest) {
        return new Promise(async function (reject, resolve) {
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

            // Successfully created MatchMakingRequest
            // Now try to create a Match for that Game
            MatchFactory.createMatch(matchMakingRequest.game_id);
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
                return;
            }

            resolve(true);
        })

    }

    private static async createMatch(game_id: number) {
        // Get Open MatchMakingRequests for Game
        let query = QueryBuilder.getMatchMakingRequestsByGame(game_id);
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
}