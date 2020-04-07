import { Session } from './session';
import { PublicUser } from './publicuser';

export class LoginResponse {
    public successful: boolean;
    public session: Session;
    public user: PublicUser;

    public constructor(successful: boolean, session?: Session, user?: PublicUser) {
        this.successful = successful;
        if (session && user) {
            this.session = session;
            this.user = user;
        }
    }
}
