export class Login {
    public session_id: string;
    public email: string;
    public password_hash: string;
    public stay_logged_in: boolean;

    public constructor(session_id?: string, email?: string, password_hash?: string, stay_logged_in?: boolean) {

        if (session_id && (!email || !password_hash)) {
            // login doesn't work if session_id is an empty string
            if (session_id === '') {
                session_id = 'x';
            }
            this.session_id = session_id;
            this.email = null;
            this.password_hash = null;
        } else if (!session_id && (email && password_hash)) {
            this.session_id = null;
            this.email = email;
            this.password_hash = password_hash;

        } else {
            this.session_id = null;
            this.email = null;
            this.password_hash = null;
        }

        if (stay_logged_in) {
            this.stay_logged_in = stay_logged_in;
        }
    }
}
