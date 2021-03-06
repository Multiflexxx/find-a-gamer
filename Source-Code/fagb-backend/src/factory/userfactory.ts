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
import { QueryObject } from '../data_objects/queryobject';
import { EditProfileRequest } from '../data_objects/editprofilerequest';
import { DiscordInformation } from 'src/data_objects/discordinformation';
import { Discord } from './discord';

export class UserFactory {
    public static async createUser(registration: Registration): Promise<User> {
        // Create discord avatar URL from discordInformation
        const path: string = "../../discordAPI.json";
        const discord: any = await require(path);

        // Get Discord information
        const discordInfo: DiscordInformation = await Discord.getDiscordInformation(registration.discordToken);
        const avatarUrl: string = `${discord.discord_avatars_uri}${discordInfo.userID}/${discordInfo.avatar}.png`;

        // Delete Discord Information from DB
        if(!(await Discord.deleteDiscordInformation(registration.discordToken))) {
            console.error("UserFactory createUser(): Couldn't delete Discord Info");
            return null;
        }

        // Create User
        const query: QueryObject = QueryBuilder.createUser(registration, avatarUrl);
        let successful: boolean = false;

        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('UserFactory createUser(): Database Query threw exception');
            console.error(e);
        }

        if(!successful) {
            console.error('UserFactory createUser(): Couldn\'t create User');
            return null;
        }

        // Get created User
        const user: User = await UserFactory.getUserByEmail(registration.email);
        if (!user) {
            console.error('UserFactory createUser(): Couldn\'t get created User by Email')
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
            console.error('UserFactory createUser(): Couldn\'t create UserGamePairs');
            return null;
        }

        // Get Games for User
        const games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error('UserFactory createUser(): Couldn\'t get Games for User');
            return null;
        }
        user.games = games;

        // Create User Language Pairs
        successful = await UserLanguagePairFactory.createUserLanguagePairs(user, registration.languages);
        if(!successful) {
            console.error('UserFactory createUser(): Couldn\'t create UserLanguagePairs');
            return null;
        }

        // Get Languages for User
        const languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error('UserFactory createUser(): Couldn\'t get Languages for User');
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
        let result: any = null;
        const query: QueryObject = QueryBuilder.getUserByEmail(email);
        let user: User;
        try {
            result = (await ConnectToDatabaseService.executeQuery(query))[0];
            user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);
        } catch(e) {
            console.error('UserFactory getUserByEmail(): Database Query threw exception');
            console.error(e);
        }

        if (!user) {
            return null;
        }

        const region: Region = await RegionFactory.getRegionById(result.region_id);
        if(!region) {
            console.error('UserFactory createUser(): Couldn\'t get region for User');
            return null;
        }
        user.region = region;

        // Get Games for user
        const games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error('UserFactory createUser(): Couldn\'t get Games for User');
            return null;
        }
        user.games = games;

        // Get Languages for User
        const languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error('UserFactory getUserByEmail(): Couldn\'t get Languages for User');
            return null;
        }
        user.languages = languages;
        return user;

    }

    public static async getUserBySessionID(session_id: string): Promise<User> {

        const query: QueryObject = QueryBuilder.getUserBySessionID(session_id);
        let result: any;
        let user: User;

        try {
           result = (await ConnectToDatabaseService.executeQuery(query))[0];
           user = new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography);
        } catch (e) {
            console.error('UserFactory getUserBySessionID(): Database Query threw exception');
            console.error(e);
        }

        if (!user) {
            console.error('UserFactory getUserBySessionID(): No User with that Session');
            return null;
        }

        // Get region for User
        const region: Region = await RegionFactory.getRegionById(result.region_id);
        if(!region) {
            console.error('UserFactory createUser(): Couldn\'t get region for User');
            return null;
        }
        user.region = region;

        // Get Games for user
        const games: Game[] = await GameFactory.getGamesForUser(user);
        if(!games) {
            console.error('UserFactory createUser(): Couldn\'t get Games for User');
            return null;
        }
        user.games = games;

        // Get Languages for User
        const languages: Language[] = await LanguageFactory.getLanguagesForUser(user);
        if(!languages) {
            console.error('UserFactory getUserBySessionID(): Couldn\'t get languages');
            return null;
        }
        user.languages = languages;

        return user;
    }

    public static async deleteUser(user: User): Promise<User> {
        // Delete UserGamePair
        let query: QueryObject = QueryBuilder.deleteUserGamePairsByUser(user);
        let successful: boolean = false;

        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch(e) {
            console.error('UserFactory deleteUser(): Database Query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('UserFactory deleteUser(): couldn\'t delete user game pair');
            return null;
        }

        // Delete UserLanguagePair
        query = QueryBuilder.deleteUserLanguagePairsByUser(user);
        successful = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('UserFactory deleteUser(): Database Query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('UserFactory deleteUser(): couldn\'t delete user language pair');
            return null;
        }

        query = QueryBuilder.deleteUser(user);
        successful = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch (e) {
            console.error('UserFactory deleteUser(): Database Query threw exception');
            console.error(e);
        }

        if (!successful) {
            console.error('UserFactory deleteUser(): couldn\'t delete user');
            return null;
        }

        return user;
    }

    public static async getUserByUserId(user_id: number): Promise<User> {
        const query: QueryObject = QueryBuilder.getUserByUserId(user_id);
        let user: User;
        let result: any;
        try {
            result = await ConnectToDatabaseService.executeQuery(query);
            user = new User(result[0].user_id, result[0].email, result[0].password_hash, result[0].nickname, result[0].discord_tag, result[0].profile_picture, result[0].cake_day, result[0].birthdate, result[0].biography);
        } catch (e) {
            console.error('UserFactory getUserByUserId(): Database Query threw exception');
            console.error(e);
        }

        if(!user) {
            console.error('UserFactory getUserByUserId(): Couldn\'t get User')
            return null;
        }

        // TODO: Auslagern von getLanguages, getGames, getRegion...
        user = await UserFactory.getUserByEmail(user.email);
        if(!user) {
            console.error('UserFactory getUserByUserId: Couldn\'t get User by Email')
            return null;
        }

        return user;
    }

    public static async updateUser(editProfileRequest: EditProfileRequest): Promise<PublicUser> {
        // Get user to be updated
        const user: User = await UserFactory.getUserBySessionID(editProfileRequest.session_id);

        // Check for Public User
        if(!!editProfileRequest.publicUser) {
            // Update Public User
            // Update Games
            const newGames = await GameFactory.updateGamesForUser(user, editProfileRequest.publicUser.games);
            if(!newGames) {
                console.error('UserFactory updateUser(): Couldn\'t update games');
                return null;
            }

            // Update Languages
            const newLanguages = await LanguageFactory.updateLanguagesForUser(user, editProfileRequest.publicUser.languages);
            if(!newLanguages) {
                console.error('UserFactory updateUser(): Couldn\'t update languages');
                return null;
            }

            // Update Biography, ProfilePicture & Region
            // Direct attributes of User, so they can be updated right away
            const query: QueryObject = QueryBuilder.updateUser(user.user_id, editProfileRequest.publicUser.biography, editProfileRequest.publicUser.profile_picture, editProfileRequest.publicUser.region.region_id);
            let successful: boolean = false;
            try {
                await ConnectToDatabaseService.executeQuery(query);
                successful = true;
            } catch(e) {
                console.error('UserFactory updateUser(): Database Query threw exception');
                console.error(e);
            }

            if(!successful) {
                console.error('UserFactory updateUser(): Couldn\'t update user');
                return null;
            }
        }

        // Check for new Password
        if(!!editProfileRequest.nPassword) {
            // Update password
            const query: QueryObject = QueryBuilder.updatePasswordForUser(user.user_id, editProfileRequest.nPassword);
            let successful: boolean = false;
            try {
                await ConnectToDatabaseService.executeQuery(query);
                successful = true;
            } catch(e) {
                console.error('UserFactory updateUser(): Database Query threw exception');
                console.error(e);
            }

            if(!successful) {
                console.error('UserFactory updateUser(): Couldn\'t update password for user');
                return null;
            }
        }

        return await UserFactory.userToPublicUser(await UserFactory.getUserBySessionID(editProfileRequest.session_id));
    }

    public static async userToPublicUser(user: User): Promise<PublicUser> {
        return new PublicUser(user.user_id, user.nickname, user.discord_tag, user.cake_day, user.region, user.games, user.languages, user.profile_picture, user.biography);
    }

    public static async checkIfUserExistsByEmail(email: string): Promise<boolean> {
        const query: QueryObject = QueryBuilder.getUserByEmail(email);
        let result: any;
        try {
            result = (await ConnectToDatabaseService.executeQuery(query))[0];
        } catch(e) {
            console.error('UserFactory updateUser(): Database Query threw exception');
            console.error(e);
        }

        if(!result) {
            return false;
        }

        return true;
    }

}

