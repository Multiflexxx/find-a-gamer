export class Session {
    public session_id: string;
    public user_id: number;
    public stay_logged_in: boolean; // needed for cookie setting in frontend after login and registration

    public constructor (session_id: string, user_id: number, stay_logged_in: boolean) {
        this.session_id = session_id;
        this.user_id = user_id;
        this.stay_logged_in = stay_logged_in;
    }
}