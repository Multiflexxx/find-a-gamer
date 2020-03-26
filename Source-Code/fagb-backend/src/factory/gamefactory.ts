import { Game } from "src/data_objects/game";
import { User } from "src/data_objects/user";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { UserGamePairFactory } from "./usergamepairfactory";

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


    public static async getGamesForUser(user: User): Promise<Game[]> {
        return new Promise(async function(resolve, reject) {
            let result;
            let games: Game[] = [];
            await ConnectToDatabaseService.getPromise(QueryBuilder.getGamesByUser(user)).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("ConnectToDatabaseService getPromise(): Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });
            result.forEach(game => {
                games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });
            resolve(games);
        });
    }

    public static async updateGamesForUser(user: User, newGames: Game[]) {
        return new Promise(async function(resolve, reject) {
            // Update UserGamePairs
            let successful;
            await UserGamePairFactory.updateUserGamePairs(user, newGames).then(function(callbackValue) {
                successful = callbackValue;
            }, function(callbackValue) {
                console.error("GameFactory updateGamesForUser(): Couldn't update User Game Pairs");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

            // Get Updated Games for User
            let games;
            GameFactory.getGamesForUser(user).then(function(callbackValue) {
                games = callbackValue;
            }, function(callbackValue) {
                console.error("GameFactory updateGamesForUser(): Couldn't get updated Games for User");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!games) {
                return;
            }

            resolve(games);
        });
    }
}