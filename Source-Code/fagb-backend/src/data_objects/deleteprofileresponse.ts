import { User } from './user';
import { PublicUser } from './publicuser';

export class DeleteProfileResponse {
    public successfull: boolean;
    public user: PublicUser;

    public constructor(successfull: boolean, user?: PublicUser) {
        this.successfull = successfull;

        if(user) {
            this.user = user;
        } else {
            this.user = null;
        }
    }

}