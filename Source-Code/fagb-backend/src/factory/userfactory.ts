import { User } from '../data_objects/user';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserLanguagePair } from '../data_objects/userlanguagepair';
import { UserGamePair } from '../data_objects/usergamepair';

export class UserFactory {
    // public static createUser(registration: Registration): User {
    //     // Create User
    //     //let dbConnection = new ConnectToDatabaseService();
    //     //dbConnection.executeQuery(QueryBuilder.createUser(registration));

    //     // get created User
    //     let user = UserFactory.getUserByEmail(registration.email);
        
    //     // Create Language User Pairs

    //     // Create Game User Pairs
    //     return null;
    // };

    // private static getLanguagePairs(user_id: number): UserLanguagePair[] {
    //     return null;
    // }

    // private static getGamePairs(user_id: number): UserGamePair[] {
    //     return null;
    // }

    // private static getUserByEmail(email: string): User {
    //     let dbConnection = new ConnectToDatabaseService();
    //     let result = dbConnection.getResult(QueryBuilder.getUserByEmail(email))[0];
    //     return new User(result.user_id, result.email, result.password_hash, result.nickname, result.discord_tag, result.profile_picture, result.cake_day, result.birthdate, result.biography, result.region);
        
    // }
}