import { Game } from '../data_objects/game';
import { User } from '../data_objects/user';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { UserGamePairFactory } from './usergamepairfactory';
import { QueryObject } from '../data_objects/queryobject';

export class GameFactory {

    public static async getGamesForUser(user: User): Promise<Game[]> {
        // Get Updated Games
        const query: QueryObject = QueryBuilder.getGamesByUser(user);
        let result: any;

        try {
            result = await ConnectToDatabaseService.executeQuery(query);
        } catch (e) {
            console.error('GameFactory getGamesForUser(): Database Query threw exception');
            console.error(e);
        }

        if (!result) {
            console.error('GameFactory getGamesForUser(): result is empty or null after getting Games for User');
            return null;
        }

        const newGames: Game[] = [];
        for (const game of result) {
            newGames.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
        }

        return newGames;
    }

    /**
     * Updates games for User and returns new Games as Game[] array
     * @param user User to be updated
     * @param newGames Games to be update user with
     */
    public static async updateGamesForUser(user: User, newGames: Game[]): Promise<Game[]> {
        // Update UserGamePairs
        let successful: boolean = await UserGamePairFactory.deleteUserGamePairsByUser(user);
        if (!successful) {
            console.error('GameFactory updateGamesForUser(): Couldn\'t delete UserGamePairs');
            return null;
        }

        // create new User Game Pairs
        successful = await UserGamePairFactory.createUserGamePairs(user, newGames);
        if (!successful) {
            console.error('GameFactory updateGamesForUser(): Couldn\'t create new UserGamePairs');
            return null;
        }


        // Get Updated Games for User
        const games: Game[] = await GameFactory.getGamesForUser(user);
        if (!games) {
            console.error('GameFactory updateGamesForUser(): Couldn\'t get Games for User');
            return null;
        }

        return games;
    }

    public static async getAllGames(): Promise<Game[]> {
        const query: QueryObject = QueryBuilder.getGames();
        const games: Game[] = [];

        try {
            const result: any[] = await ConnectToDatabaseService.executeQuery(query);
            await result.forEach(game => {
                games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });
        } catch(e) {
            console.error('GameFactory getAllGames(): Database Query threw exception')
            console.error(e);
        }

        if (!games) {
            console.error('GameFactory getAllGames(): Couldn\'t get all Games');
            return null;
        }

        return games;
    }

    public static async getGameById(game_id: number): Promise<Game> {
        const query: QueryObject = QueryBuilder.getGameById(game_id);
        let game: Game;
        try {
           const result: any = (await ConnectToDatabaseService.executeQuery(query))[0];
           game = new Game(result.game_id, result.name, result.cover_link, result.game_description, result.publisher, result.published);
        } catch(e) {
            console.error('GameFactory getGameById(): Database Query threw exception');
            console.error(e);
        }


        if (!game) {
            console.error('GameFactory getGameById(): Couldn\'t get Game with game_id + ' + game_id);
            return null;
        }
        return game;
    }
}