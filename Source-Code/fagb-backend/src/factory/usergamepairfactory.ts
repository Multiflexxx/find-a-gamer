import { User } from "src/data_objects/user";
import { Game } from "src/data_objects/game";
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service'
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { UserGamePair } from 'src/data_objects/usergamepair'
import { rejects } from "assert";

export class UserGamePairFactory {
    // public static createUserGamePairs(user: User, games: Game[]): void {
    //     let c = new ConnectToDatabaseService();
    //     for(let game of games) {
    //         c.executeQuery(QueryBuilder.createUserGamePair(user, game));
    //     }
    // }

    // public static getUserGamePairs(user: User): UserGamePair[] {
    //     let userGamesPairs: UserGamePair[];
    //     let c = new ConnectToDatabaseService();
    //     let result = c.getResult(QueryBuilder.getUserGamePairs(user));

    //     for(let r of result) {
    //         userGamesPairs.push(new UserGamePair(r.pair_id, r.user_id, r.game_id));
    //     }

    //     return userGamesPairs;
    // }

    public static async createUserGamePairs(user: User, games: Game[]) {
        return new Promise(function (resolve, reject) {
            games.forEach(async game => {
                let query = QueryBuilder.createUserGamePair(user, game);
                await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                    // Successfully created
                }, function (callbackValue) {
                    console.error("UserGamePairFactory createUserGamePairs(): Couldn't create UserGamePairs")
                    console.error(callbackValue);
                    reject(callbackValue);
                });
            });
            resolve(true);
        });
    }

    public static async deleteUserGamePairsByUser(user: User) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.deleteUserGamePairsByUser(user);
            let successful = false;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                successful = true;
            }, function (callbackValue) {
                console.error("UserGamePairFactory deleteUserGamePairsByUser(): Couldn't delete UserGamePairs");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                return;
            }

            resolve(true);
        });
    }

    public static async updateUserGamePairs(user: User, newGames: Game[]) {
        return new Promise(async function (resolve, reject) {
            // Delete old User Game pairs
            let successful;
            await UserGamePairFactory.deleteUserGamePairsByUser(user).then(function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("UserGamePairFactory updateUserGamePairs(): Couldn't delete UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                return;
            }

            // create new User Game Pairs
            successful = null;
            await UserGamePairFactory.createUserGamePairs(user, newGames).then(function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("UserGamePairFactory updateUserGamePairs(): Couldn't create UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

            resolve(true);

        });
    }
}