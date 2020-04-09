import { User } from "../data_objects/user";
import { Language } from "../data_objects/language";
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service'
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { UserLanguagePair } from "../data_objects/userlanguagepair";
import { QueryObject } from "src/data_objects/queryobject";

export class UserLanguagePairFactory {
    // public static createUserLanguagePairs(user: User, languages: Language[]): void {
    //     let c = new ConnectToDatabaseService();
    //     for(let lang of languages) {
    //         //c.executeQuery(QueryBuilder.createUserLanguagePair(user, lang));
    //     }
    // }

    // public static getUserLanguagePairs(user: User): UserLanguagePair[] {
    //     let userLanguagesPairs: UserLanguagePair[];
    //     let c = new ConnectToDatabaseService();
    //     let result = c.getResult(QueryBuilder.getUserLanguagePairs(user));

    //     for(let r of result) {
    //         userLanguagesPairs.push(new UserLanguagePair(r.pair_id, r.user_id, r.language_id));
    //     }

    //     return userLanguagesPairs;
    // }

    public static async createUserLanguagePairs(user: User, languages: Language[]) {
        languages.forEach(async language => {
            let query: QueryObject = QueryBuilder.createUserLanguagePair(user, language);
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                // Successfully created Pairs
            }, function(callbackValue) {
                console.error(callbackValue);
                return false;
            });
        });
        return true;
    }


    public static async deleteUserLanguagePairs(user: User): Promise<boolean> {
        let query: QueryObject = QueryBuilder.deleteUserLanguagePairsByUser(user);
        let successful: boolean = false;

        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            successful = true;
        }, function(callbackValue) {
            console.error("UserLanguagePairFactory deleteUserLanguagePairs(): Couldn't delete UserLanguagePair");
            console.error(callbackValue);
            return false;
        });

        if (!successful) {
            return false;
        }

        return true;
    }

    // public static async updateUserLanguagePairs(user: User, newLanguages: Language[]) {
    //     return new Promise(async function(resolve, reject) {
    //         // Delete old User Language Pairs
    //         let successful;
    //         await UserLanguagePairFactory.deleteUserLanguagePairs(user).then(function(callbackValue) {
    //             successful = callbackValue;
    //         }, function(callbackValue) {
    //             console.error("UserLanguagePairFactory updateUserLanguagePairs(): Couldn't delete UserLanguagePairs");
    //             console.error(callbackValue);
    //             reject(callbackValue);
    //         });

    //         if(!successful) {
    //             return;
    //         }

    //         // Create new User Language Pairs
    //         successful = null;
    //         await UserLanguagePairFactory.createUserLanguagePairs(user, newLanguages).then(function(callbackValue) {
    //             successful = callbackValue;
    //         }, function(callbackValue) {
    //             console.error("UserLanguagePairFactory updateUserLanguagePairs() Couldn't delete UserLanguagePair");
    //             console.error(callbackValue);
    //             reject(callbackValue);
    //         });

    //         if(!successful) {
    //             return
    //         }

    //         resolve(true);
    //     });
    // }

    public static async updateUserLanguagePairs(user: User) {
        // Delete old User Language Pairs
        let successful;
        await UserLanguagePairFactory.deleteUserLanguagePairs(user).then(function(callbackValue) {
            successful = callbackValue;
        }, function(callbackValue) {
            console.error("UserLanguagePairFactory updateUserLanguagePairs(): Couldn't delete UserLanguagePairs");
            console.error(callbackValue);
        });

        if(!successful) {
            return false;
        }

        // Create new User Language Pairs
        // successful = null;
        // await UserLanguagePairFactory.createUserLanguagePairs(user, user.languages).then(function(callbackValue) {
        //     successful = callbackValue;
        // }, function(callbackValue) {
        //     console.error("UserLanguagePairFactory updateUserLanguagePairs() Couldn't delete UserLanguagePair");
        //     console.error(callbackValue);
        // });

        // if(!successful) {
        //     return false;
        // }

        // Create new UserLanguagePairs
        for(let language of user.languages) {
            let successful;
            let query = QueryBuilder.createUserLanguagePair(user, language);
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserLanguagePairFactory updateUserLanguagePairs(): Couldn't create UserLanguagePairs");
                console.error(callbackValue);
            });

            if(!successful) {
                return false;
            }
        }

        return true;
    }
}