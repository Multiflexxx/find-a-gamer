import { User } from '../data_objects/user';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserLanguagePair } from '../data_objects/userlanguagepair';
import { UserGamePair } from '../data_objects/usergamepair';
import { GameFactory } from './gamefactory';
import { LanguageFactory } from './languagefactory';
import { RegionFactory } from './regionfactory';
import { Region } from 'src/data_objects/region';
import { UserGamePairFactory } from './usergamepairfactory';
import { Game } from 'src/data_objects/game';
import { UserLanguagePairFactory } from './userlanguagepairfactory';
import { Language } from 'src/data_objects/language';

export class UserFactory {
    public static async createUser(registration: Registration): Promise<User> {
        return new Promise(async function(resolve, reject) {
            // Create User
            let query = QueryBuilder.createUser(registration);
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                // Alles gut
            }, function(callbackValue) {
                // nix gut
                console.error(callbackValue);
                reject(callbackValue);
            });

            // Get created User
            let result;
            await UserFactory.getUserByEmail(registration.email).then(function(callbackValue) {
                result = callbackValue;
                console.log(result);
                console.log(callbackValue);
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });
            
            let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result. profile_picture, result.cake_day, result.birthdate, result.biography);

            // Get Region
            // await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
            //     result = callbackValue;
            // }, function(callbackValue) {
            //     console.error(callbackValue);
            //     reject(callbackValue);
            // });

            user.region = new Region(result.region_id, result.name);
            
            // Create User Game Pairs
            await UserGamePairFactory.createUserGamePairs(user, registration.games).then(function(callbackValue) {
                // Successfully created User Game Pairs
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });

            // Get Games for User
            await GameFactory.getGamesForUser(user).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });
            user.games = [];
            result.forEach(game => {
                user.games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });

            // Create User Language Pairs
            await UserLanguagePairFactory.createUserLanguagePairs(user, registration.languages).then(function(callbackValue) {
                // Successfully created User Language Pairs
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            })

            // Get Languages for User
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            });

            user.languages = [];
            result.forEach(language => {
                user.languages.push(new Language(language.language_id, language.name, language.language_code))
            });

            resolve(user);
        });
    };

    // private static getLanguagePairs(user_id: number): UserLanguagePair[] {
    //     return null;
    // }

    // private static getGamePairs(user_id: number): UserGamePair[] {
    //     return null;
    // }

    public static async getUserByEmail(email: string): Promise<User> {
        return new Promise(async function(resolve, reject) {
            let dbConnection = new ConnectToDatabaseService();
            let query = QueryBuilder.getUserByEmail(email);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("");
                console.error(callbackValue);
                reject(callbackValue);
            });
    
            let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);

            await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
                result = callbackValue;
            }, function(callbackValue) {
                console.error("Failed to get Region in UserFactory getUserByEmail");
                console.error(callbackValue);
            })
            user.region = new Region(result.region_id, result.name);
            
            // Get Games for user
            await GameFactory.getGamesForUser(user).then(function(callbackValue) {
                user.games = callbackValue;
            }, function(callbackValue) {
                console.error("GameFactory getGamesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });

            // Get Languages for User
            await LanguageFactory.getLanguagesForUser(user).then(function(callbackValue) {
                user.languages = callbackValue;
            }, function(callbackValue) {
                console.error("LanguageFactory getLanguagesForUser: Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(user);
        });

    }
}