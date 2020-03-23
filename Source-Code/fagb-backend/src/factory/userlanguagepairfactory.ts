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
}