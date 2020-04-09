import { Language } from "../data_objects/language";
import { User } from "../data_objects/user";
import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { UserLanguagePair } from "../data_objects/userlanguagepair";
import { UserLanguagePairFactory } from "./userlanguagepairfactory";
import { GameFactory } from "./gamefactory";
import { QueryObject } from "src/data_objects/queryobject";

export class LanguageFactory {

    public static async getLanguagesForUser(user: User): Promise<Language[]> {
        let query: QueryObject = QueryBuilder.getLanguagesByUser(user);
        let languages: Language[] = [];
        try {
            let result: any[] = await ConnectToDatabaseService.executeQuery(query);
            result.forEach(language => {
                languages.push(new Language(language.language_id, language.name, language.language_code));
            });
        } catch(e) {
            console.error("LanguageFactory getLanguagesForUser(): Database Query threw exception");
            console.error(e);
        }

        if(!languages) {
            console.error("LanguageFactory getLanguagesForUser(): Couldn't get languages")
            return null;
        }

        return languages;
    }

    public static async updateLanguagesForUser(user: User, newLanguages: Language[]): Promise<boolean> {

        let successful: boolean = await UserLanguagePairFactory.updateUserLanguagePairs(user, newLanguages);

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

        try {
            let result: any[] = await ConnectToDatabaseService.executeQuery(query);
            result.forEach(language => {
                languages.push(new Language(language.language_id, language.name, language.language_code));
            });
        } catch(e) {
            console.error("LanguageFactory getAllLanguages(): Database Query threw exception")
            console.error(e);
        }

        if(!languages || !languages[0]) {
            console.error("LanguageFactory getAllLanguages(): Couldn't get all Languages");
            return null;
        }

        return languages;
    }

    public static async getLanguageById(language_id: number): Promise<Language> {
        let query: QueryObject = QueryBuilder.getLanguageById(language_id);
        let language: Language;

        try {
            let result: any = await ConnectToDatabaseService.executeQuery(query);
            language = new Language(result.language_id, result.name, result.language_code)
        } catch(e) {
            console.error("LanguageFactory getLanguageById(): Database Query threw exception");
            console.error(e);
        }

        if(!language) {
            console.error("LanguageFactory getLanguageById(): Couldn't get language");
            return null;
        }

        return language;
    }
}