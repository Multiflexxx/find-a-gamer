export class MatchMakingRequest {

    session_id: string;
    user_id: number;
    game_id: number;
    searching_for: number;
    players_in_party: number;
    casual: boolean;
    time_stamp: Date;

    public constructor(session_id: string, user_id: number, game_id: number, searching_for: number, players_in_party: number, casual: boolean, time_stamp: Date) {
        this.session_id = session_id;
        this.user_id = user_id;
        this.game_id = game_id;
        this.searching_for = searching_for;
        this.players_in_party = players_in_party;
        this.casual = casual;
        this.time_stamp = time_stamp;
    }
}