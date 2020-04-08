import { User } from '../data_objects/user';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserLanguagePair } from '../data_objects/userlanguagepair';
import { UserGamePair } from '../data_objects/usergamepair';
import { GameFactory } from './gamefactory';
import { LanguageFactory } from './languagefactory';
import { RegionFactory } from './regionfactory';
import { Region } from '../data_objects/region';
import { UserGamePairFactory } from './usergamepairfactory';
import { Game } from '../data_objects/game';
import { UserLanguagePairFactory } from './userlanguagepairfactory';
import { Language } from '../data_objects/language';
import { PublicUser } from '../data_objects/publicuser';
import { QueryObject } from 'src/data_objects/queryobject';

export class UserFactory {
    public static async createUser(registration: Registration): Promise<User> {
        // Create User
        let query: QueryObject = QueryBuilder.createUser(registration);
        let successful: boolean = false;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error(callbackValue);
        });

        if(!successful) {
            console.error("UserFactory createUser(): Couldn't create User");
            return null;
        }

        // Get created User
        let user: User = await UserFactory.getUserByEmail(registration.email);
        if (!user) {
            console.error("UserFactory createUser(): Couldn't get created User by Email")
            return null;
        }

        // let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);

        // // Get Region
        // result = null;
        // await RegionFactory.getRegionById(result.region_id).then(function(callbackValue) {
        //     result = callbackValue;
        // }, function(callbackValue) {
        //     console.error(callbackValue);
        //     reject(callbackValue);
        // });

        // if(!result) {
        //     return;
        // }

        // user.region = new Region(result.region_id, result.name);

        // Create User Game Pairs
        successful = await UserGamePairFactory.createUserGamePairs(user, registration.games);
        if(!successful) {
            console.error("UserFactory createUser(): Couldn't create UserGamePairs");
            return null;
        }

        // Get Games for User
        let games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error("UserFactory createUser(): Couldn't get Games for User");
            return null;
        }
        user.games = games;

        // Create User Language Pairs
        successful = await UserLanguagePairFactory.createUserLanguagePairs(user, registration.languages);
        if(!successful) {
            console.error("UserFactory createUser(): Couldn't create UserLanguagePairs");
            return null;
        }

        // Get Languages for User
        let languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error("UserFactory createUser(): Couldn't get Languages for User");
            return null;
        }
        user.languages = languages;

        return user;
    };

    // private static getLanguagePairs(user_id: number): UserLanguagePair[] {
    //     return null;
    // }

    // private static getGamePairs(user_id: number): UserGamePair[] {
    //     return null;
    // }

    public static async getUserByEmail(email: string): Promise<User> {

        let query: QueryObject = QueryBuilder.getUserByEmail(email);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            result = callbackValue[0];
        }, function (callbackValue) {
            console.error("");
            console.error(callbackValue);
        });

        if (!result) {
            return null;
        }

        let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);

        let region: Region = await RegionFactory.getRegionById(result.region_id);
        if(!region) {
            console.error("UserFactory createUser(): Couldn't get region for User");
            return null;
        }
        user.region = region;

        // Get Games for user
        let games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error("UserFactory createUser(): Couldn't get Games for User");
            return null;
        }
        user.games = games;

        // Get Languages for User
        let languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error("UserFactory getUserByEmail(): Couldn't get Languages for User");
            return null;
        }
        user.languages = languages;
        return user;

    }

    public static async getUserBySessionID(session_id: string): Promise<User> {

        let query: QueryObject = QueryBuilder.getUserBySessionID(session_id);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            result = callbackValue[0];
        }, function (callbackValue) {
            console.error("UserFactory getUserBySessionID(): Couldn't get User");
            console.error(callbackValue);
        });

        if (!result) {
            console.error("UserFactory getUserBySessionID(): No User with that Session");
            return null;
        }

        let user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);

        // Get region for User
        let region: Region = await RegionFactory.getRegionById(result.region_id);
        if(!region) {
            console.error("UserFactory createUser(): Couldn't get region for User");
            return null;
        }
        user.region = region;

        // Get Games for user
        let games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error("UserFactory createUser(): Couldn't get Games for User");
            return null;
        }
        user.games = games;

        // Get Languages for User
        let languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error("UserFactory getUserBySessionID(): Couldn't get languages");
            return null;
        }
        user.languages = languages;

        return user;
    }

    public static async deleteUser(user: User): Promise<User> {
        // Delete UserGamePair
        let query: QueryObject = QueryBuilder.deleteUserGamePairsByUser(user);
        let successful: boolean = false;

        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error("UserFactory deleteUser(): Couldn't delete User Game Pair");
            console.error(callbackValue);
        });

        if (!successful) {
            console.error("UserFactory deleteUser(): couldn't delete user game pair");
            return null;
        }

        // Delete UserLanguagePair
        query = QueryBuilder.deleteUserLanguagePairsByUser(user);
        successful = false;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error("UserFactory deleteUser(): Couldn't delete user language pair");
            console.error(callbackValue);
        });

        if (!successful) {
            console.error("UserFactory deleteUser(): couldn't delete user language pair");
            return null;
        }

        query = QueryBuilder.deleteUser(user);
        successful = false;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error("UserFactory deleteUser(): Couldn't delete user");
            console.error(callbackValue);
        });

        if (!successful) {
            console.error("UserFactory deleteUser(): couldn't delete user");
            return null;
        }

        return user;
    }

    public static async getUserByUserId(user_id): Promise<User> {
        let query: QueryObject = QueryBuilder.getUserByUserId(user_id);
        let user: User;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            user = new User(callbackValue[0].user_id, callbackValue[0].email, callbackValue[0].password_hash, callbackValue[0].nickname, callbackValue[0].discord_tag, callbackValue[0].profile_picture, callbackValue[0].cake_day, callbackValue[0].birthdate, callbackValue[0].biography);
        }, function (callbackValue) {
            console.error("UserFactory getUserByUserId(): Couldn't get user from database");
            console.error(callbackValue);
        });

        if(!user) {
            console.error("UserFactory getUserByUserId(): Couldn't get User")
            return null;
        }

        // TODO: Auslagern von getLanguages, getGames, getRegion...
        user = await UserFactory.getUserByEmail(user.email);
        if(!user) {
            console.error("UserFactory getUserByUserId: Couldn't get User by Email")
            return null;
        }

        return user;
    }

    public static userToPublicUser(user: User): PublicUser {
        return new PublicUser(user.user_id, user.nickname, user.discord_tag, user.cake_day, user.region, user.games, user.languages, user.profile_picture, user.biography);
    }
}

