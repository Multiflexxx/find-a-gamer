import { User } from './user';

export class DeleteProfileResponse {
    public successfull: boolean;
    public user: User;

    public constructor(successfull: boolean, user?: User) {
        this.successfull = successfull;

        if (user) {
            this.user = user;
        } else {
            this.user = null;
        }
    }

}