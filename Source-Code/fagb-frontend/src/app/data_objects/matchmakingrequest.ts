export class MatchMakingRequest {

    public request_id: number;
    public session_id: string;
    public user_id: number;
    public game_id: number;
    public searching_for: number;
    public players_in_party: number;
    public casual: boolean;
    public time_stamp: Date;
    public match_id: string;

    public constructor(session_id: string, user_id: number, game_id: number, searching_for: number, players_in_party: number, casual: boolean, match_id?: string, time_stamp?: Date, request_id?: number) {
        this.session_id = session_id;
        this.user_id = user_id;
        this.game_id = game_id;
        this.searching_for = searching_for;
        this.players_in_party = players_in_party;
        this.casual = casual;

        if(match_id) {
            this.match_id = match_id;
        }

        if(time_stamp) {
            this.time_stamp = time_stamp;
        }

        if(request_id) {
            this.request_id = request_id;
        }
    }
}