import { User } from '../data_objects/user';
import { Registration } from '../data_objects/registration';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserLanguagePair } from '../data_objects/userlanguagepair';
import { UserGamePair } from '../data_objects/usergamepair';

export class UserFactory {
    public static createUser(registration: Registration): User {
        // Create User
        
        let dbConnection = new ConnectToDatabaseService();
        dbConnection.executeQuery(QueryBuilder.createUser(registration));
        
        // Create Language User Pairs

        // Create Game User Pairs
        return null;
    };

    private static getLanguagePairs(user_id: number): UserLanguagePair[] {
        return null;
    }

    private static getGamePairs(user_id: number): UserGamePair[] {
        return null;
    }


}