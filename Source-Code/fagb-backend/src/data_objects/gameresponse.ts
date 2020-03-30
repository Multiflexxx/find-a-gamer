import {Game} from "./game";

export class GameResponse {
    public game: Game;
    public counter: number;

    public constructor(game: Game, counter: number) {
        this.game = game;
        this.counter = counter;
    }
}