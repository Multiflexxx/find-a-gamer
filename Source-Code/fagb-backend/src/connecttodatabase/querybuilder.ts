import { User } from '../data_objects/user';
import { Language } from '../data_objects/language';
import { Game } from '../data_objects/game';
import { Region } from '../data_objects/region';
import { Registration } from '../data_objects/registration';
import { QueryObject } from '../data_objects/queryobject';

export class QueryBuilder {
    public static createUser(registration: Registration): QueryObject {
        return new QueryObject(
            "INSERT INTO User (email, password_hash, nickname, discord_tag, cake_day, birthdate, region_id) VALUES (?, ?, ?, ?, CURRENT_DATE, ?, ?);",
             [
                registration.email,
                registration.password_hash,
                registration.nickname,
                registration.discord_tag,
                registration.birthdate,
                registration.region.region_id
             ]
        );
//        return `INSERT INTO User (email, password_hash, nickname, discord_tag, cake_day, birthdate, region_id) VALUES (${registration.email}, ${registration.password_hash}, ${registration.nickname}, ${registration.discord_tag}, CURRENT_DATE, ${registration.birthdate}, ${registration.region.region_id});`;
    }

    public static createUserLanguagePair(user: User, language: Language): QueryObject {
        return new QueryObject(
            "INSERT INTO User_Language_Pair (language_id, user_id) VALUES (?, ?);",
            [
                language.language_id,
                user.user_id
            ]
        );
        // return `INSERT INTO User_Language_Pair (language_id, user_id) VALUES (${language.language_id}, ${user.user_id});`;
    }

    public static createUserGamePair(user: User, game: Game): QueryObject {
        return new QueryObject(
            "INSERT INTO User_Game_Pair (user_id, game_id) VALUES (?, ?);",
            [
                user.user_id,
                game.game_id
            ]
        );
    }

    public static getUserLanguagePairs(user: User): any {
        /*return {
            query: "SELECT * FROM User_Language_Pair WHERE user_id = ?",
            parameter: [
                user.user_id
            ]
        }

        c.query(value.query, value.parameter)
        */
        
        // return `SELECT * FROM User_Language_Pair WHERE user_id = ${user.user_id};`;
    }

    public static getUserGamePairs(user: User): QueryObject {
        return new QueryObject(
            "SELECT * FROM User_Language_Pair WHERE user_id = ?;",
            [
                user.user_id
            ]
        );
        // return `SELECT * FROM User_Language_Pair WHERE user_id = ${user.user_id};`
    }

    public static getUserByEmail(email: string): QueryObject {
        return new QueryObject(
            "SELECT * FROM User WHERE email = ?;",
            [
                email
            ]
        );
        
        // return `SELECT * FROM User WHERE email = ${email};`;
    }

    public static getUserBySessionID(session_id: string): QueryObject {
        return new QueryObject(
            "SELECT User.* FROM Session RIGHT JOIN User ON (Session.user_id=User.user_id) WHERE session_id = UUID_TO_BIN(?)",
            [
                session_id
            ]
        );
    }


    public static getLanguagesByUser(user: User): QueryObject {
        return new QueryObject(
            "SELECT Language.language_id, Language.name, Language.language_code From Language JOIN User_Language_Pair ON Language.language_id = User_Language_Pair.language_id WHERE User_Language_Pair.user_id = ?;",
            [
                user.user_id
            ]
        );
        // return `SELECT Language.language_id, Language.name, Language.language_code From Language JOIN User_Language_Pair ON Language.language_id = User_Language_Pair.language_id WHERE User_Language_Pair.user_id = ${user.user_id};`;
    }

    public static getGamesByUser(user: User): QueryObject {
        // return `SELECT Game.game_id, Game.name, Game.cover_link, Game.game_description, Game.publisher, Game.published FROM Game JOIN User_Game_Pair ON Game.game_id = User_Game_Pair.game_id WHERE User_Game_Pair.user_id = ${user.user_id};`;

        return new QueryObject(
            "SELECT Game.game_id, Game.name, Game.cover_link, Game.game_description, Game.publisher, Game.published FROM Game JOIN User_Game_Pair ON Game.game_id = User_Game_Pair.game_id WHERE User_Game_Pair.user_id = ?",
            [
                user.user_id
            ]  
        );
    }
    
    public static getRegions(): QueryObject {
        return new QueryObject(
            "SELECT region_id FROM Region ORDER BY name ASC;"
        );
        
        // return 'SELECT region_id FROM Region;';
    }

    public static getRegionById(region_id: number) {
        return new QueryObject(
            "SELECT * FROM Region WHERE region_id = ?",
            [
                region_id
            ]
        );
    }

    public static getLanguages(): QueryObject {
        return new QueryObject(
             "SELECT * FROM Language;"
        );    
    }
    
    public static getGames(): QueryObject {
        return new QueryObject(
            "SELECT * FROM Game;"
        );
    }

    public static getGameById(game_id: number): QueryObject {
        return new QueryObject(
            "SELECT * FROM Game WHERE game_id = ?;",
            [
                game_id
            ]
        );
    }

    public static getLanguageById(language_id: number): QueryObject {
        return new QueryObject(
            "SELECT * FROM Language WHERE language_id = ?;",
            [
                language_id
            ]
        );
    }

    public static getSessionBySessionId(session_id: string): QueryObject {
        return new QueryObject(
            "SELECT BIN_TO_UUID(session_id) as session_id, user_id, stay_logged_in, expiration_date FROM Session WHERE session_id = UUID_TO_BIN(?)",
            [
                session_id
            ]
        );
    }

    public static createSession(session_id: string, user: User, stay_logged_in: boolean): QueryObject {
        if(stay_logged_in) {
            return new QueryObject(
                "INSERT INTO Session (session_id, user_id, stay_logged_in, expiration_date) VALUES (UUID_TO_BIN(?), ?, ?, DATE_ADD(CURRENT_DATE(), INTERVAL 1 YEAR));",
                [
                    session_id,
                    user.user_id,
                    stay_logged_in
                ]
            );
        } else {
            return new QueryObject(
                "INSERT INTO Session (session_id, user_id, stay_logged_in) VALUES (UUID_TO_BIN(?), ?, ?);",
                [
                    session_id,
                    user.user_id,
                    stay_logged_in
                ]
            );
        }
    }

    public static getSessionByUserId(user: User): QueryObject {
        return new QueryObject(
            "SELECT BIN_TO_UUID(session_id) as session_id, user_id, stay_logged_in, expiration_date FROM Session WHERE user_id = ?",
            [
                user.user_id
            ]
        );
    }

    public static deleteSessionByUserId(user: User) {
        return new QueryObject(
            "DELETE FROM Session Where user_id = ?",
            [
                user.user_id
            ]
        );
    }

}