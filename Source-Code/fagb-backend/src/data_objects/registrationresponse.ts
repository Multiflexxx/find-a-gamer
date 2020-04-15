import { Session } from '../data_objects/session';

export class RegistrationResponse {
    public successful: boolean;
    public session_object: Session;
    public message: string;

    public constructor (successful: boolean, session_object: Session, message: string) {
        this.successful = successful;
        this.session_object = session_object;
        this.message = message;
    }
}