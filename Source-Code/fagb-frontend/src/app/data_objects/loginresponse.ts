import { Session } from "inspector";
import { User } from "./user";

export class LoginResponse {
    public successful: boolean;
    public session: Session;
    public user: User;

    public constructor(successful: boolean, session?: Session, user?: User) {
        this.successful = successful;
        if(session && user) {
            this.session = session;
            this.user = user;
        }
    }
}