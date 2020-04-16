import { User } from './user';
import { PublicUser } from './publicuser';

export class DeleteProfileResponse {
    public successfull: boolean;
<<<<<<< HEAD
    public publicUser: PublicUser;

    public constructor(successfull: boolean, publicUser?: PublicUser) {
=======
    public user: PublicUser;

    public constructor(successfull: boolean, user?: PublicUser) {
>>>>>>> ad6ad6b4bb050f36c1b5ae17b9024959cfbe951d
        this.successfull = successfull;

        if(publicUser) {
            this.publicUser = publicUser;
        } else {
            this.publicUser = null;
        }
    }

}