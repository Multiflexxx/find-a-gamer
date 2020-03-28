import { User } from "./user";

export class EditProfileResponse {
    public successful: boolean;
    public user: User;

    public constructor(successful: boolean, user?: User) {
        this.successful = successful;
        
        if(user) {
            this.user = user;
        } else {
            this.user = null;
        }
    }
}