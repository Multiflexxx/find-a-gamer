import { User } from './user';
import { PublicUser } from './publicuser';

export class DeleteProfileResponse {

    public successful: boolean;
    public publicUser: PublicUser;


    public constructor(successfull: boolean, publicUser?: PublicUser) {

        this.successful = successfull;

        if(publicUser) {
            this.publicUser = publicUser;
        } else {
            this.publicUser = null;
        }
    }
}