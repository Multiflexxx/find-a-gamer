import { Game } from "../data_objects/game";
import { User } from "../data_objects/user";
import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { UserGamePairFactory } from "./usergamepairfactory";
import { QueryObject } from "../data_objects/queryobject";
export class GameFactory {
    // public static async getGamesForUser(user: User): Game[] {
    //     let c = new ConnectToDatabaseService();
    //     //let result = c.getResult(QueryBuilder.getGamesByUser(user));
    //     let Games: Game[];

    //     // for(let r of result) {
    //     //     //Games.push(new Game(result.Game_id, result.name, result.Game_code));
    //     // }

    //     return Games;
    // }


    // public static async getGamesForUser(user: User): Promise<Game[]> {
    //     return new Promise(async function (resolve, reject) {
    //         let result;
    //         let games: Game[] = [];
    //         let query = QueryBuilder.getGamesByUser(user);
    //         // query = new QueryObject("SELECT * From User_Game_Pair WHere user_id = ?;", [2]);
    //         console.log(query);
    //         await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
    //             // console.log("Callback value in getGamesForUser");
    //             // console.log(callbackValue);
    //             result = callbackValue;
    //         }, function (callbackValue) {
    //             console.error("ConnectToDatabaseService getPromise(): Promise rejected");
    //             console.error(callbackValue);
    //             reject(callbackValue);
    //         });

    //         if (!result || !result[0]) {
    //             console.log(result);
    //             console.error("No Games for User");
    //             reject(false);
    //             return;
    //         }

    //         result.forEach(game => {
    //             games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
    //         });
    //         resolve(games);
    //     });
    // }

    public static async getGamesForUser(user: User) {
        // Get Updated Games
        let query = QueryBuilder.getGamesByUser(user);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            result = callbackValue;
            console.log(callbackValue);
        }, function(callbackValue) {
            console.error("GameFactory getGamesForUser(): Couldn't get Games for User");
            console.error(callbackValue);
        });

        if(!result) {
            console.error("GameFactory getGamesForUser(): result is empty or null after getting Games for User");
            console.error(result);
            return false;
        }

        let newGames: Game[] = [];
        for(let game of result) {
            newGames.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
        }

        return newGames;
    }

    public static async updateGamesForUser(user: User, newGames: Game[]) {
        return new Promise(async function (resolve, reject) {
            // Update UserGamePairs
            let successful;
            let games;
            
            await UserGamePairFactory.deleteUserGamePairsByUser(user).then(async function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("GameFactory updateGamesForUser(): Couldn't delete UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                return;
            }

            // create new User Game Pairs
            successful = null;
            await UserGamePairFactory.createUserGamePairs(user, newGames).then(async function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("GameFactory updateGamesForUser(): Couldn't create UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

             // Get Updated Games for User
            await GameFactory.getGamesForUser(user).then(async function (callbackValue2) {
                games = callbackValue2;
                console.log(games);
            }, function (callbackValue2) {
                console.error("GameFactory updateGamesForUser(): Couldn't get get Games for User");
                console.error(callbackValue2);
                reject(callbackValue2);
            });

            if (!games) {
                return;
            }

            resolve(games);
        });
    }

    public static async getAllGames() {
        let query = QueryBuilder.getGames();
        let games;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            games = callbackValue;
        }, function(callbackValue) {
            console.error("GameFactory getAllGames(): Couldn't get all Games");
            console.error(callbackValue);
        });

        return games;
    }

    public static async getGameById(game_id: number) {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.getGameById(game_id);
            let game;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                game = callbackValue;
                // console.log("callbackValue in getGameById");
                // console.log(callbackValue);
            }, function(callbackValue) {
                console.error("GameFactory getGameById(): Couldn't get game");
                console.error("callbackValue");
            });

            if(!game) {
                console.error("GameFactory getGameById(): No Game with game_id + " + game_id);
                reject(false);
                return;
            }

            resolve(game);
        });
    }

    // public static async getAllGameResponses() {
    //     return new Promise(function(resolve, reject) {
    //         await GameFactory.
    //     });
    // }


    // public static async updateGamesForUser(user: User, newGames: Game[]) {
    //     // Delete old User game Pairs

    // }

    // public static delay(ms: number) {
    //     return new Promise( resolve => setTimeout(resolve, ms) );
    // }
}