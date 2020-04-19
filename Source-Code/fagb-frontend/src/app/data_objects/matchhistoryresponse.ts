import { MatchMakingResponse } from "./matchmakingresponse";
import { PublicUser } from "./publicuser";

export class MatchHistoryResponse {
    public totalAmount: number;
    public publicUser: PublicUser;
    public matchHistory: MatchMakingResponse[];

    public constructor(publicUser: PublicUser, totalAmount: number, matchHistory: MatchMakingResponse[]) {
        this.publicUser = publicUser;
        this.totalAmount = totalAmount;
        this.matchHistory = matchHistory;
    }
}