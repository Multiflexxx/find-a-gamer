import { Language } from "src/data_objects/language";
import { User } from "src/data_objects/user";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { UserLanguagePair } from "src/data_objects/userlanguagepair";
import { UserLanguagePairFactory } from "./userlanguagepairfactory";

export class LanguageFactory {
    // public static getLanguagesForUser(user: User): Language[] {
    //     let c = new ConnectToDatabaseService();
    //     let result = c.getResult(QueryBuilder.getLanguagesByUser(user));
    //     let languages: Language[];

    //     for(let r of result) {
    //         languages.push(new Language(result.language_id, result.name, result.language_code));
    //     }

    //     return languages;
    // }
    
    public static async getLanguagesForUser(user: User): Promise<Language[]> {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.getLanguagesByUser(user);
            let languages: Language[] = [];
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                callbackValue.forEach(language => {
                    languages.push(new Language(language.language_id, language.name, language.language_code));
                });
            }, function(callbackValue) {
                console.error("LanguageFactory getLanguagesForUser(): Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(languages);
        });
    }

    public static async updateLanguagesForUser(user: User, newLanguages: Language[]) {
        return new Promise(async function(resolve, reject) {
            let successful;
            await UserLanguagePairFactory.updateUserLanguagePairs(user, newLanguages).then(function(callbackValue) {
                successful = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory updateLanguagesForUser(): Couldn't update UserLanguagePairs");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

            let languages;
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                languages = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory updateLanguagesForUser(): Couldn't get Languages for User");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!languages) {
                return;
            }

            resolve(languages);
        });
    }

    public static async deleteLanguagesForUser(user: User) {
        return new Promise(async function(resolve, reject){
            let successful;
            await UserLanguagePairFactory.deleteUserLanguagePairs(user).then(function(callbackValue) {
                successful = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory deleteLanguagesForUser(): Couldn't delete Languages for User");
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