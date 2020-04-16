import { User } from './user';
import { Session } from './session';
import { PublicUser } from './publicuser';

export class DeleteProfileRequest {

    public publicUser: PublicUser;
    public session_id: string;

    public constructor( session_id: string, publicUser: PublicUser) {
        this.publicUser = publicUser;
        this.session_id = session_id;
    }
}