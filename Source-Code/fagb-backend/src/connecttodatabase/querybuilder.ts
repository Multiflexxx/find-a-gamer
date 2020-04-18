import { User } from '../data_objects/user';
import { Language } from '../data_objects/language';
import { Game } from '../data_objects/game';
import { Region } from '../data_objects/region';
import { Registration } from '../data_objects/registration';
import { QueryObject } from '../data_objects/queryobject';
import { MatchMakingRequest } from '../data_objects/matchmakingrequest';

export class QueryBuilder {
    public static createUser(registration: Registration): QueryObject {
        return new QueryObject(
            'INSERT INTO User (email, password_hash, nickname, discord_tag, cake_day, birthdate, region_id) VALUES (?, ?, ?, ?, CURRENT_DATE, ?, ?);',
             [
                registration.email,
                registration.password_hash,
                registration.nickname,
                registration.discord_tag,
                registration.birthdate,
                registration.region.region_id
             ]
        );
    }

    public static createUserLanguagePair(user: User, language: Language): QueryObject {
        return new QueryObject(
            'INSERT INTO User_Language_Pair (language_id, user_id) VALUES (?, ?);',
            [
                language.language_id,
                user.user_id
            ]
        );
        // return `INSERT INTO User_Language_Pair (language_id, user_id) VALUES (${language.language_id}, ${user.user_id});`;
    }

    public static createUserGamePair(user: User, game: Game): QueryObject {
        return new QueryObject(
            'INSERT INTO User_Game_Pair (user_id, game_id) VALUES (?, ?);',
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
            'SELECT * FROM User_Language_Pair WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
        // return `SELECT * FROM User_Language_Pair WHERE user_id = ${user.user_id};`
    }

    public static getUserByEmail(email: string): QueryObject {
        return new QueryObject(
            'SELECT * FROM User WHERE email = ?;',
            [
                email
            ]
        );

        // return `SELECT * FROM User WHERE email = ${email};`;
    }

    public static getUserBySessionID(session_id: string): QueryObject {
        return new QueryObject(
            'SELECT User.* FROM Session RIGHT JOIN User ON (Session.user_id=User.user_id) WHERE session_id = UUID_TO_BIN(?)',
            [
                session_id
            ]
        );
    }


    public static getLanguagesByUser(user: User): QueryObject {
        return new QueryObject(
            'SELECT Language.language_id, Language.name, Language.language_code From Language JOIN User_Language_Pair ON Language.language_id = User_Language_Pair.language_id WHERE User_Language_Pair.user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static getGamesByUser(user: User): QueryObject {

        return new QueryObject(
            'SELECT Game.game_id, Game.name, Game.cover_link, Game.game_description, Game.publisher, Game.published FROM Game JOIN User_Game_Pair ON Game.game_id = User_Game_Pair.game_id WHERE User_Game_Pair.user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static getRegions(): QueryObject {
        return new QueryObject(
            'SELECT * FROM Region ORDER BY name ASC;'
        );

        // return 'SELECT region_id FROM Region;';
    }

    public static getRegionById(region_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM Region WHERE region_id = ?',
            [
                region_id
            ]
        );
    }

    public static getLanguages(): QueryObject {
        return new QueryObject(
             'SELECT * FROM Language;'
        );
    }

    public static getGames(): QueryObject {
        return new QueryObject(
            'SELECT * FROM Game;'
        );
    }

    public static getGameById(game_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM Game WHERE game_id = ?;',
            [
                game_id
            ]
        );
    }

    public static getLanguageById(language_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM Language WHERE language_id = ?;',
            [
                language_id
            ]
        );
    }

    public static getSessionBySessionId(session_id: string): QueryObject {
        return new QueryObject(
            'SELECT BIN_TO_UUID(session_id) as session_id, user_id, stay_logged_in, expiration_date FROM Session WHERE session_id = UUID_TO_BIN(?)',
            [
                session_id
            ]
        );
    }

    public static createSession(session_id: string, user: User, stay_logged_in: boolean): QueryObject {
        if(stay_logged_in) {
            return new QueryObject(
                'INSERT INTO Session (session_id, user_id, stay_logged_in, expiration_date) VALUES (UUID_TO_BIN(?), ?, ?, DATE_ADD(CURRENT_DATE(), INTERVAL 1 YEAR));',
                [
                    session_id,
                    user.user_id,
                    stay_logged_in
                ]
            );
        } else {
            return new QueryObject(
                'INSERT INTO Session (session_id, user_id, stay_logged_in) VALUES (UUID_TO_BIN(?), ?, ?);',
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
            'SELECT BIN_TO_UUID(session_id) as session_id, user_id, stay_logged_in, expiration_date FROM Session WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static deleteSessionByUserId(user: User): QueryObject {
        return new QueryObject(
            'DELETE FROM Session WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    // public static updateUser(user: User): QueryObject {
    //     return new QueryObject(
    //         "UPDATE User SET email = ?, password_hash = ?, nickname = ?, discord_tag = ?, profile_picture = ?, birthdate = ?, biography = ?, region_id = ? WHERE user_id = ?;",
    //         [
    //             user.email,
    //             user.password_hash,
    //             user.nickname,
    //             user.discord_tag,
    //             user.profile_picture,
    //             user.birthdate,
    //             user.biography,
    //             user.region.region_id,
    //             user.user_id
    //         ]
    //     );
    // }

    public static updateUser(user_id: number, biography: string, profile_picture: string, region_id: number): QueryObject {
        return new QueryObject(
            'UPDATE User SET biography = ?, profile_picture = ?, region_id = ? WHERE user_id = ?',
            [
                biography,
                profile_picture,
                region_id,
                user_id
            ]
        );
    }

    public static updatePasswordForUser(user_id: number, password_hash: string): QueryObject {
        return new QueryObject(
            'UPDATE User SET password_hash = ? WHERE user_id = ?',
            [
                password_hash,
                user_id
            ]
        );
    }

    public static deleteUser(user: User): QueryObject {
        return new QueryObject(
            'DELETE FROM User WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static deleteUserGamePairsByUser(user: User): QueryObject {
        return new QueryObject(
            'DELETE FROM User_Game_Pair WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static deleteUserLanguagePairsByUser(user: User): QueryObject {
        return new QueryObject(
            'DELETE FROM User_Language_Pair WHERE user_id = ?;',
            [
                user.user_id
            ]
        );
    }

    public static createMatchMakingRequest(matchMakingRequest: MatchMakingRequest): QueryObject {
        return new QueryObject(
            'INSERT INTO MatchMakingRequest (user_id, game_id, searching_for, players_in_party, casual) VALUES (?, ?, ?, ?, ?);',
            [
                matchMakingRequest.user_id,
                matchMakingRequest.game_id,
                matchMakingRequest.searching_for,
                matchMakingRequest.players_in_party,
                matchMakingRequest.casual
            ]
        );
    }

    public static getOpenMatchMakingRequestsByGame(game_id: number, region_id: number, casual: boolean): QueryObject {
        return new QueryObject(
            'SELECT MatchMakingRequest.* FROM MatchMakingRequest JOIN User ON (MatchMakingRequest.user_id = User.user_id) WHERE game_id = ? AND region_id = ? AND casual = ? AND match_id IS NULL ORDER BY time_stamp ASC;',
            [
                game_id,
                region_id,
                casual
            ]
        );
    }

    public static getNoOfMatchMakingRequestsByGame(): QueryObject {
        return new QueryObject(
            // "SELECT Game.*, sum(players_in_party) AS players_searching FROM MatchMakingRequest RIGHT JOIN Game ON (MatchMakingRequest.game_id = Game.game_id) WHERE match_id IS NULL GROUP BY game_id;"
            'Select sum(CASE WHEN match_id IS NULL THEN players_in_party ELSE 0 END) as players_count, match_id, Game.* FROM Game LEFT JOIN MatchMakingRequest ON Game.game_id = MatchMakingRequest.game_id GROUP BY game_id;'
        );
    }

    public static getOpenMatchMakingRequestByUser(user_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM MatchMakingRequest WHERE user_id = ? AND match_id IS NULL;',
            [
                user_id
            ]
        );
    }

    public static updateMatchmakingRequest(matchMakingRequest: MatchMakingRequest): QueryObject {
        return new QueryObject(
            'UPDATE MatchMakingRequest SET match_id = UUID_TO_BIN(?) WHERE request_id = ?;',
            [
                matchMakingRequest.match_id,
                matchMakingRequest.request_id
            ]
        );
    }

    public static getUserByUserId(user_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM User WHERE user_id = ?;',
            [
                user_id
            ]
        );
    }

    public static getMostRecentRequestByUserId(user_id: number): QueryObject {
        return new QueryObject(
            'SELECT * FROM MatchMakingRequest WHERE user_id = ? AND match_id IS NULL ORDER BY time_stamp ASC;',
            [
                user_id
            ]
        );
    }

    public static getMatchMakingRequestByRequestId(request_id: number): QueryObject {
        return new QueryObject(
            'SELECT request_id, user_id, game_id, searching_for, players_in_party, casual, time_stamp, BIN_TO_UUID(match_id) as match_id FROM MatchMakingRequest WHERE request_id = ?;',
            [
                request_id
            ]
        );
    }

    public static getMatchMakingRequestsByMatchId(match_id: string): QueryObject {
        return new QueryObject(
            "SELECT request_id, user_id, game_id, searching_for, players_in_party, casual, time_stamp, BIN_TO_UUID(match_id) as match_id FROM MatchMakingRequest WHERE match_id = UUID_TO_BIN(?);",
            [
                match_id
            ]
        );
    }

    public static deleteMatchMakingRequest(request_id: number): QueryObject {
        return new QueryObject(
            'DELETE FROM MatchMakingRequest WHERE request_id = ?;',
            [
                request_id
            ]
        );
    }

    public static matchHistoryNoPaging(user_id: number): QueryObject {
        return new QueryObject(
            "SELECT * FROM MatchMakingRequest Where user_id = ? AND match_id IS NOT NULL ORDER BY time_stamp DESC",
            [
                user_id
            ]
        );
    }

    public static matchHistoryWithPaging(user_id: number, first: number, next: number): QueryObject {
        return new QueryObject(
            "SELECT request_id, user_id, game_id, searching_for, players_in_party, casual, time_stamp, BIN_TO_UUID(match_id) as match_id FROM MatchMakingRequest Where user_id = ? AND match_id IS NOT NULL ORDER BY time_stamp DESC LIMIT ?, ?",
            [
                user_id,
                first,
                next  
            ]
        );
    }

    public static getNumberOfMatchedRequestsByUser(user_id: number): QueryObject {
        return new QueryObject(
            "SELECT count(*) as amount FROM MatchMakingRequest WHERE user_id = ? AND match_id IS NOT NULL GROUP BY user_id;",
            [
                user_id
            ]
        );
    }

}