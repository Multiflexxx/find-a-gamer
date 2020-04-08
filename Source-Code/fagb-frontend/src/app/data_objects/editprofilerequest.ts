import { User } from './user';

export class EditProfileRequest {

    public user: User;
    public session_id: string;

    public constructor(session_id: string, user: User) {
        this.user = user;
        this.session_id = session_id;
    }
}
