import { User } from "./user";
import { Session } from "./session";

export class EditProfileRequest {

    public user: User;
    public session_id: string;

    constructor(session_id: string, user: User) {
        this.user = user;
        this.session_id = session_id;
    }
}