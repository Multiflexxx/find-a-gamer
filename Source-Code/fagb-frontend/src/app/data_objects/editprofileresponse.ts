import { PublicUser } from './publicuser';

export class EditProfileResponse {
    public successful: boolean;
    public publicUser: PublicUser;

    public constructor(successful: boolean, publicUser?: PublicUser) {
        this.successful = successful;

        if (!!publicUser) {
            this.publicUser = publicUser;
        }
    }
}
