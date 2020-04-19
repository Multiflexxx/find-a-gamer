import { PublicUser } from './publicuser';
import { MatchMakingRequest } from './matchmakingrequest';
import { User } from './user';
import { Game } from './game';

export class MatchMakingResponse {
    // public users: PublicUser[];
    // public matchmaking_request: MatchMakingRequest;
    // public game: Game;

    // public constructor(matchmaking_request: MatchMakingRequest, game: Game, users?: PublicUser[]) {
    //     if (users) {
    //         this.users = users;
    //     }

    //     this.matchmaking_request = matchmaking_request;
    //     this.game = game;
    // }

    public user: PublicUser;
    public game: Game;
    public matchMakingRequest: MatchMakingRequest;
    public matchedUsers: PublicUser[];

    public constructor(user: PublicUser, game: Game, matchMakingRequest: MatchMakingRequest, matchedUsers?: PublicUser[]) {
        this.user = user;
        this.game = game;
        this.matchMakingRequest = matchMakingRequest;
        if (matchedUsers != null) {
            this.matchedUsers = matchedUsers;
        } else {
            this.matchedUsers = null;
        }
    }

}
