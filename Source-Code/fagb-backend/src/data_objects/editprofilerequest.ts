import { User } from "./user";
import { Session } from "./session";

export class EditProfileRequest {

    public user: User;
    public session: Session;

    constructor(session: Session, user: User) {
        this.user = user;
        this.session = session;
    }
}