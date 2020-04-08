export class UserGamePair {
    public pair_id: number;
    public user_id: number;
    public game_id: number;

    public constructor(pair_id: number, user_id: number, game_id: number) {
        this.pair_id = pair_id;
        this.user_id = user_id;
        this.game_id = game_id;
    }
}
