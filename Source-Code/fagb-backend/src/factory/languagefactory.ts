import { Language } from "../data_objects/language";
import { User } from "../data_objects/user";
import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { UserLanguagePair } from "../data_objects/userlanguagepair";
import { UserLanguagePairFactory } from "./userlanguagepairfactory";
import { GameFactory } from "./gamefactory";
import { QueryObject } from "src/data_objects/queryobject";

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
        let query: QueryObject = QueryBuilder.getLanguagesByUser(user);
        let languages: Language[] = [];
        await ConnectToDatabaseService.getPromise(query).then(callbackValue => {
            callbackValue.forEach(language => {
                languages.push(new Language(language.language_id, language.name, language.language_code));
            });
        }, callbackValue => {
            console.error("LanguageFactory getLanguagesForUser(): Promise rejected");
            console.error(callbackValue);
            return null;
        });
        return languages;
    }

    public static async updateLanguagesForUser(user: User): Promise<boolean> {

        let successful: boolean = await UserLanguagePairFactory.updateUserLanguagePairs(user);

        if(!successful) {
            console.error("LanguageFactory updateLanguagesForUser(): Couldn't update UserLanguagePairs");
            return false;
        }

        let languages: Language[] = await LanguageFactory.getLanguagesForUser(user);

        if(!languages) {
            console.error("LanguageFactory updateLanguagesForUser(): Couldn't get Languages for User");
            return false;
        }

        return true;

    }

    public static async deleteLanguagesForUser(user: User): Promise<boolean> {
        let successful: boolean = await UserLanguagePairFactory.deleteUserLanguagePairs(user);

        if(!successful) {
            console.error("LanguageFactory deleteLanguagesForUser(): Couldn't delete Languages for User");
            return false;
        }

        return true;
    }

    public static async getAllLanguages(): Promise<Language[]> {
        let query: QueryObject = QueryBuilder.getLanguages();
        let languages: Language[] = [];
        await ConnectToDatabaseService.getPromise(query).then(async callbackValue => {
            await callbackValue.forEach(language => {
                languages.push(new Language(language.language_id, language.name, language.language_code));
            });
        }, callbackValue => {
            console.error("LanguageFactory getAllLanguages(): Couldn't get all Languages");
            return null;
        });

        return languages;
    }

    public static async getLanguageById(language_id: number): Promise<Language> {
        let query: QueryObject = QueryBuilder.getLanguageById(language_id);
        let language: Language;
        await ConnectToDatabaseService.getPromise(query).then(callbackValue => {
            if(!callbackValue[0]) {
                language = new Language(callbackValue.language_id, callbackValue.name, callbackValue.language_code);
            } else {
                language = new Language(callbackValue[0].language_id, callbackValue[0].name, callbackValue[0].language_code);
            }
        }, callbackValue => {
            console.error("LanguageFactory getLanguageById(): Couldn't get Language");
            console.error(callbackValue);
        });

        if(!language) {
            console.error("LanguageFactory getLanguageById(): No language with that ID");
            return null;
        }

        return language;
    }
}