export class Session {
    public session_id: string;
    public user_id: number;
    public stay_logged_in: boolean; // needed for cookie setting in frontend after login and registration
}