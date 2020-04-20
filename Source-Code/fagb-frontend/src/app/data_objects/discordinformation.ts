export class DiscordInformation {
    public token: string;
    public userID: string;
    public username: string;
    public avatar: string;
    public discriminator: string;

    public constructor(token: string, userID: string, username: string, avatar: string, discriminator: string) {
        this.token = token;
        this.userID = userID;
        this.username = username;
        this.avatar = avatar;
        this.discriminator = discriminator;
    }
}
