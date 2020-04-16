import { User } from './user';
import { PublicUser } from './publicuser';

export class DeleteProfileResponse {
    public successfull: boolean;
    public publicUser: PublicUser;

    public constructor(successfull: boolean, publicUser?: PublicUser) {
        this.successfull = successfull;

        if(publicUser) {
            this.publicUser = publicUser;
        } else {
            this.publicUser = null;
        }
    }

}