import { PublicUser } from './publicuser';

export class EditProfileRequest {

    public publicuser: PublicUser;
    public session_id: string;

    public constructor(session_id: string, publicuser: PublicUser) {
        this.publicuser = publicuser;
        this.session_id = session_id;
    }
}
