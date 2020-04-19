export class MatchHistoryRequest {
    public session_id: string;
    public user_id: number;

    // For paging
    public first: number;
    public next: number;

    public constructor(session_id: string, user_id: number, first?: number, next?: number) {
        this.session_id = session_id;
        this.user_id = user_id;

        if (first != null && next != null) {
            this.first = first;
            this.next = next;
        } else {
            this.first = null;
            this.next = null;
        }
    }
}
