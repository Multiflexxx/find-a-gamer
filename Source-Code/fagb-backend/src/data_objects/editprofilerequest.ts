import { PublicUser } from './publicuser';

export class EditProfileRequest {
    public session_id: string;
    public publicUser: PublicUser;
    public oPassword: string;
    public nPassword: string;

    public constructor(session_id: string, publicUser: PublicUser, oPassword?: string, nPassword?: string) {
        this.session_id = session_id;
        this.publicUser = publicUser;

        if (!(!oPassword || !nPassword)) {
            this.oPassword = oPassword;
            this.nPassword = nPassword;
        }
    }
}