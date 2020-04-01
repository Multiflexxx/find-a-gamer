import { User } from "./user";
import { PublicUser } from "./publicuser";

export class EditProfileResponse {
    public successful: boolean;
    public user: PublicUser;

    public constructor(successful: boolean, user?: PublicUser) {
        this.successful = successful;
        
        if(user) {
            this.user = user;
        } else {
            this.user = null;
        }
    }
}