import { MatchMakingRequest } from "./matchmakingrequest";

export class DeleteMatchMakingResponse {
    public successful: boolean;
    public request: MatchMakingRequest;

    public constructor(successful: boolean, request?: MatchMakingRequest) {
        if(request != null) {
            this.request = request;
        }
        
        this.successful = successful;
    }
}