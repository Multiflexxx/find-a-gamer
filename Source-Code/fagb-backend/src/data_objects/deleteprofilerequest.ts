import { User } from './user';
import { Session } from './session';

export class DeleteProfileRequest {

    public user: User;
    public session_id: string;

    public constructor( session_id: string, user: User) {
        this.user = user;
        this.session_id = session_id;
    }
}