import { User } from '../data_objects/user';
import { Language } from '../data_objects/language';
import { Game } from '../data_objects/game';
import { Region } from '../data_objects/region';
import { Registration } from '../data_objects/registration';

export class QueryBuilder {
    public static createUser(registration: Registration): string {
        return `INSERT INTO User (email, password_hash, nickname, discord_tag, cake_day, birthdate, region_id) VALUES (${registration.email}, ${registration.password_hash}, ${registration.nickname}, ${registration.discord_tag}, CURRENT_DATE, ${registration.birthdate}, ${registration.region.region_id})`;
    }

    public static createUserLanguagePair(user: User, language: Language) {
        return `INSERT INTO User_Language_Pair (language_id, user_id) VALUES (${language.language_id}, ${user.user_id})`;
    }

    public static createUserGamePair(user: User, game: Game) {
        return `INSERT INTO User_Game_Pair (user_id, game_id) VALUES (${user.user_id}, ${game.game_id})`;
    }

    public static getUserByEmail(email: String) {
        return `SELECT * FROM User WHERE email = ${email}`;
    }
    
    public static getRegions(): string {
        return 'SELECT region_id FROM Region;'
    }

    public static getLanguages(): string {
        return 'SELECT language_id FROM Language;'
    }
    
    public static getGames(): string {
        return 'SELECT game_id FROM Game;'
    }
}