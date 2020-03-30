export class Response {
    // General Response
    public successful: boolean;
    public message: string;

    public constructor(successful: boolean, message: string) {
        this.successful = successful;
        this.message = message;
    }
}