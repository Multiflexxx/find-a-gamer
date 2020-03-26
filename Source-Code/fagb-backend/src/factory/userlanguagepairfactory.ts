import { User } from "src/data_objects/user";
import { Language } from "src/data_objects/language";
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service'
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { UserLanguagePair } from "src/data_objects/userlanguagepair";

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
        return new Promise(function(resolve, reject) {
            languages.forEach(async language => {
                let query = QueryBuilder.createUserLanguagePair(user, language);
                await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                    // Successfully created Pairs
                }, function(callbackValue) {
                    console.error(callbackValue);
                    reject(callbackValue);
                });
            });
            resolve(true);
        });
    }


    public static async deleteUserLanguagePairs(user: User) {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.deleteUserLanguagePairsByUser(user);
            let successful = false;

            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                successful = true;
            }, function(callbackValue) {
                console.error("UserLanguagePairFactory deleteUserLanguagePairs(): Couldn't delete UserLanguagePair");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                return;
            }

            resolve(true);
        });
    }

    public static async updateUserLanguagePairs(user: User, newLanguages: Language[]) {
        return new Promise(async function(resolve, reject) {
            // Delete old User Language Pairs
            let successful;
            await UserLanguagePairFactory.deleteUserLanguagePairs(user).then(function(callbackValue) {
                successful = callbackValue;
            }, function(callbackValue) {
                console.error("UserLanguagePairFactory updateUserLanguagePairs(): Couldn't delete UserLanguagePairs");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

            // Create new User Language Pairs
            successful = null;
            await UserLanguagePairFactory.createUserLanguagePairs(user, newLanguages).then(function(callbackValue) {
                successful = callbackValue;
            }, function(callbackValue) {
                console.error("UserLanguagePairFactory updateUserLanguagePairs() Couldn't delete UserLanguagePair");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return
            }

            resolve(true);
        });
    }
}