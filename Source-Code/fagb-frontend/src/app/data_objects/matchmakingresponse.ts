import { PublicUser } from './publicuser';
import { MatchMakingRequest } from './matchmakingrequest';
import { Game } from './game';

export class MatchMakingResponse {
    public users: PublicUser[];
    public matchmaking_request: MatchMakingRequest;
    public game: Game;

    public constructor(matchmaking_request: MatchMakingRequest, game: Game, users?: PublicUser[]) {
        if (users) {
            this.users = users;
        }

        this.matchmaking_request = matchmaking_request;
        this.game = game;
    }
}
