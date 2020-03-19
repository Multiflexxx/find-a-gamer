import { Session } from '../data_objects/session';

export class RegistrationResponse {
    public successful: boolean;
    public session_object: Session;

    constructor (successful: boolean, session_object: Session) {
        this.successful = successful; 
        this.session_object = session_object;
    }
}