import { User } from "../data_objects/user";
import { Game } from "../data_objects/game";
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service'
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserGamePair } from '../data_objects/usergamepair'
import { rejects } from "assert";
import { EditProfileResponse } from "../data_objects/editprofileresponse";
import { QueryObject } from "src/data_objects/queryobject";

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

    public static async createUserGamePairs(user: User, games: Game[]): Promise<boolean> {
        await games.forEach(async game => {
            let query: QueryObject = QueryBuilder.createUserGamePair(user, game);
            let successful: boolean = false;
            
            try {
                await ConnectToDatabaseService.executeQuery(query);
                successful = true;
            } catch(e) {
                console.error("UserGamePairFactory createUserGamePairs(): Database Query threw exception");
                console.error(e);
            }

            if (!successful) {
                console.error("UserGamePairFactory createUserGamePairs(): Couldn't create UserGamePairs");
                return false;
            }
        });
        return true;


        // return new Promise(function (resolve, reject) {
        //     games.forEach(async game => {
        //         let query = QueryBuilder.createUserGamePair(user, game);
        //         await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
        //             // Successfully created
        //         }, function (callbackValue) {
        //             console.error("UserGamePairFactory createUserGamePairs(): Couldn't create UserGamePairs")
        //             console.error(callbackValue);
        //             reject(callbackValue);
        //         });
        //     });
        //     resolve(true);
        // });
    }

    public static async deleteUserGamePairsByUser(user: User): Promise<boolean> {
        let query: QueryObject = QueryBuilder.deleteUserGamePairsByUser(user);
        let successful: boolean = false; 
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error("UserGamePairFactory deleteUserGamePairs(): Database Query threw exception");
            console.error(e);
        }
        
        if (!successful) {
            console.error("UserGamePairFactory deleteUserGamePairs(): Couldn't delete UserGamePairs")
            return false;
        }

        return true;

        // return new Promise(async function (resolve, reject) {
        //     let query = QueryBuilder.deleteUserGamePairsByUser(user);
        //     let successful = false;
        //     await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
        //         successful = true;
        //     }, function (callbackValue) {
        //         console.error("UserGamePairFactory deleteUserGamePairsByUser(): Couldn't delete UserGamePairs");
        //         console.error(callbackValue);
        //         reject(callbackValue);
        //     });

        //     if (!successful) {
        //         return;
        //     }

        //     resolve(true);
        // });
    }

    // public static async updateUserGamePairs(user: User) {
    //     return new Promise(async function (resolve, reject) {
    //         // Delete old User Game pairs
    //         let successful;
    //         await UserGamePairFactory.deleteUserGamePairsByUser(user).then(function (callbackValue) {
    //             successful = callbackValue;
    //         }, function (callbackValue) {
    //             console.error("UserGamePairFactory updateUserGamePairs(): Couldn't delete UserGamePairs")
    //             console.error(callbackValue);
    //             reject(callbackValue);
    //         });

    //         if (!successful) {
    //             return;
    //         }

    //         // create new User Game Pairs
    //         successful = null;
    //         await UserGamePairFactory.createUserGamePairs(user, user.games).then(function (callbackValue) {
    //             successful = callbackValue;
    //         }, function (callbackValue) {
    //             console.error("UserGamePairFactory updateUserGamePairs(): Couldn't create UserGamePairs")
    //             console.error(callbackValue);
    //             reject(callbackValue);
    //         });

    //         if(!successful) {
    //             return;
    //         }

    //         resolve(true);
    //     });
    // }

    public static async updateUserGamePairs(user: User): Promise<boolean> {
        // Delete old User Game Pairs
        let query: QueryObject = QueryBuilder.deleteUserGamePairsByUser(user);
        let successful: boolean = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch(e) {
            console.error("UserGamePairFactory updateUserGamePairs(): Database Query threw exception");
            console.error(e);
        }
        

        if (!successful) {
            console.error("UserGamePairFactory updateUserGamePairs(): Couldn't delete UserGamePairs");
            return false;
        }

        // Create new User Game Pairs
        for (let game of user.games) {
            query = QueryBuilder.createUserGamePair(user, game);
            let successful: boolean;
            try {
                await ConnectToDatabaseService.executeQuery(query);
                successful = true;
            }catch(e) {
                console.error("UserGamePairFactory updateUserGamePairs(): Database Query threw exception");
                console.error(e);
            }
            
            if (!successful) {
                console.error("UserGamePairFactory updateUserGamePairs(): Couldn't create UserGamePairs");
                // console.error(game);
                return false;
            }
        }

        return true;
    }
}