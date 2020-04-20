export class UserLanguagePair {
    public pair_id: number;
    public user_id: number;
    public language_id: number;

    public constructor(pair_id: number, user_id: number, language_id: number) {
        this.pair_id = pair_id;
        this.user_id = user_id;
        this.language_id = language_id;
    }
}
