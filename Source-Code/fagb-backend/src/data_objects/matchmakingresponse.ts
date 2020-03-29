import { PublicUser } from "./publicuser";
import { MatchMakingRequest } from "./matchmakingrequest";
import { User } from "./user";

export class MatchMakingResponse {
    users: PublicUser[];
    matchmaking_request: MatchMakingRequest;

    public constructor(users: User[], matchmaking_request: MatchMakingRequest) {
        this.users = users;
        this.matchmaking_request = matchmaking_request;
    }
}