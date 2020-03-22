import { User } from "src/data_objects/user";
import { Game } from "src/data_objects/game";
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service'
import { QueryBuilder } from 'src/connecttodatabase/querybuilder';
import { UserGamePair } from 'src/data_objects/usergamepair'

export class UserGamePairFactory {
    // public static createUserGamePairs(user: User, games: Game[]): void {
    //     let c = new ConnectToDatabaseService();
    //     for(let game of games) {
    //         c.executeQuery(QueryBuilder.createUserGamePair(user, game));
    //     }
    // }

    // public static getUserGamePairs(user: User): UserGamePair[] {
    //     let userGamesPairs: UserGamePair[];
    //     let c = new ConnectToDatabaseService();
    //     let result = c.getResult(QueryBuilder.getUserGamePairs(user));

    //     for(let r of result) {
    //         userGamesPairs.push(new UserGamePair(r.pair_id, r.user_id, r.game_id));
    //     }

    //     return userGamesPairs;
    // }
}