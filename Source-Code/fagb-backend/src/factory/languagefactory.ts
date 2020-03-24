import { Language } from "src/data_objects/language";
import { User } from "src/data_objects/user";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";

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
                reject(callbackValue);
            })
            resolve(languages);
        });
    }
}