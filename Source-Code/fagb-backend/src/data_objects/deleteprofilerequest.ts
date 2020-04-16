import { User } from './user';
import { Session } from './session';
import { PublicUser } from './publicuser';

export class DeleteProfileRequest {

<<<<<<< HEAD
    public publicUser: PublicUser;
    public session_id: string;

    public constructor( session_id: string, publicUser: PublicUser) {
        this.publicUser = publicUser;
=======
    public user: PublicUser;
    public session_id: string;

    public constructor( session_id: string, user: PublicUser) {
        this.user = user;
>>>>>>> ad6ad6b4bb050f36c1b5ae17b9024959cfbe951d
        this.session_id = session_id;
    }
}