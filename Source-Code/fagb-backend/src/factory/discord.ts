import { DiscordInformation } from "src/data_objects/discordinformation";
import { QueryObject } from "src/data_objects/queryobject";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { v4 as uuidv4 } from 'uuid';
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";

export class Discord {

    /**
     * Saves Discord data to database and returns the token to access them again
     * @param temp 
     */
    public static async saveDiscordInformation(userID: string, username: string, avatar: string, discriminator: string): Promise<string> {

        // Create Discord Info object
        const discordInfo: DiscordInformation = new DiscordInformation(uuidv4(), userID, username, avatar, discriminator);

        const query: QueryObject = QueryBuilder.saveDiscordInfo(discordInfo)
        let successful: boolean = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch(e) {
            console.error("Discord saveDiscordInformation(): Database query threw exception");
            console.error(e);
        }

        if(!successful) {
            console.error("Discord saveDiscordInformation(): Couldn't save Discord information");
            return null;
        }

        return discordInfo.token;
    }

    public static async getDiscordInformation(token: string): Promise<DiscordInformation> {
        const query: QueryObject = QueryBuilder.getDiscordInfo(token);
        let discordInfo: DiscordInformation;
        try {
            let result: any = (await ConnectToDatabaseService.executeQuery(query))[0]
            discordInfo = new DiscordInformation(result.token, result.userID, result.username, result.avatar, result.discriminator)
        } catch(e) {
            console.error("Discord getDiscordInformation(): Database query threw exception");
            console.error(e);
        }

        if(!discordInfo) {
            console.error("Discord getDiscordInformation(): Couldn't get Discord Information");            return null;
        }

        return discordInfo;
    }
}