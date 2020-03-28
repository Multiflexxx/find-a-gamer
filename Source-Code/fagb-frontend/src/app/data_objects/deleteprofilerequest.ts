import { User } from './user';
import { Session } from './session';

export class DeleteProfileRequest {

    public user: User;
    public session: Session;

    constructor(user: User, session: Session) {
        this.user = user;
        this.session = session;
    }
}