export class Login {
    public session_id: string;
    public email: string;
    public password_hash: string;

    public constructor(session_id?: string, email?: string, password_hash?: string) {

        if(session_id && !(email || password_hash)) {
            this.session_id = session_id;
            this.email = null;
            this.password_hash = null;
        } else if(!session_id && (email && password_hash)) {
            this.session_id = null;
            this.email = email;
            this.password_hash = password_hash;

        } else {
            this.session_id = null;
            this.email = null;
            this.password_hash = null;
        }
    }
}