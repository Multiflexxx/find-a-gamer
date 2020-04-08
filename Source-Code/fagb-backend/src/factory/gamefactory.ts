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

    public static async getGamesForUser(user: User): Promise<Game[]> {
        // Get Updated Games
        let query: QueryObject = QueryBuilder.getGamesByUser(user);
        let result: any;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            result = callbackValue;
        }, function(callbackValue) {
            console.error("GameFactory getGamesForUser(): Couldn't get Games for User");
            console.error(callbackValue);
        });

        if(!result) {
            console.error("GameFactory getGamesForUser(): result is empty or null after getting Games for User");
            return null;
        }

        let newGames: Game[] = [];
        for(let game of result) {
            newGames.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
        }

        return newGames;
    }

    /**
     * Updates games for User and returns new Games as Game[] array
     * @param user User to be updated
     * @param newGames Games to be update user with
     */
    public static async updateGamesForUser(user: User, newGames: Game[]): Promise<Game[]> {
            // Update UserGamePairs
        let successful: boolean = await UserGamePairFactory.deleteUserGamePairsByUser(user);
        if (!successful) {
            console.error("GameFactory updateGamesForUser(): Couldn't delete UserGamePairs");
            return null;
        }

        // create new User Game Pairs
        successful = await UserGamePairFactory.createUserGamePairs(user, newGames);
        if(!successful) {
            console.error("GameFactory updateGamesForUser(): Couldn't create new UserGamePairs");
            return null;
        }
        

        // Get Updated Games for User
        let games: Game[] = await GameFactory.getGamesForUser(user);
        if (!games) {
            console.error("GameFactory updateGamesForUser(): Couldn't get Games for User");
            return null;
        }

        return games;
    }

    public static async getAllGames(): Promise<Game[]> {
        let query: QueryObject = QueryBuilder.getGames();
        let games: Game[];
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            callbackValue.forEach(game => {
                games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });
        }, function(callbackValue) {
            console.error("GameFactory getAllGames(): Couldn't get all Games");
            console.error(callbackValue);
        });

        if(!games) {
            console.error("GameFactory getAllGames(): Couldn't get all Games");
            return null;
        }

        return games;
    }

    public static async getGameById(game_id: number): Promise<Game> {
        let query: QueryObject = QueryBuilder.getGameById(game_id);
        let game: Game;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            game = new Game(callbackValue.game_id, callbackValue.name, callbackValue.cover_link, callbackValue.game_description, callbackValue.publisher, callbackValue.published);
        }, function(callbackValue) {
            console.error("GameFactory getGameById(): Couldn't get game");
        });

        if(!game) {
            console.error("GameFactory getGameById(): Couldn't get Game with game_id + " + game_id);
            return null;
        }
        return game;
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