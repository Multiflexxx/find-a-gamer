export class DeleteMatchMakingRequest {
      public session_id: string;
      public request_id: number;

      public constructor(session_id: string, request_id: number) {
            this.request_id = request_id;
            this.session_id = session_id;
      }
}
