import { User } from './user';
import { Session } from './session';

export class DeleteProfileRequest {

    public user: User;
    public session_id: string;

    constructor(user: User, session_id: string) {
        this.user = user;
        this.session_id = session_id;
    }
}