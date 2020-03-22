import { Game } from "src/data_objects/game";
import { User } from "src/data_objects/user";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";

export class GameFactory {
    // public static getGamesForUser(user: User): Game[] {
    //     let c = new ConnectToDatabaseService();
    //     //let result = c.getResult(QueryBuilder.getGamesByUser(user));
    //     let Games: Game[];

    //     // for(let r of result) {
    //     //     //Games.push(new Game(result.Game_id, result.name, result.Game_code));
    //     // }

    //     return Games;
    // }


    public static async getGamesForUser(user: User): Promise<Game[]> {
        let result;
        await ConnectToDatabaseService.getPromise(QueryBuilder.getGamesByUser(user)).then(function (callbackValue) {
            result = callbackValue;
        }, function (callbackValue) {
            console.log(callbackValue);
        });
        return null;
    }
}