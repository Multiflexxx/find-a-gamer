import { DiscordInformation } from "../data_objects/discordinformation";
import { QueryObject } from "../data_objects/queryobject";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { v4 as uuidv4 } from 'uuid';
import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";

export class Discord {

    /**
     * Saves Discord data to database and returns the token to access them again
     * @param temp 
     */
    public static async saveDiscordInformation(userID: string, username: string, avatar: string, discriminator: string): Promise<string> {

        // Create Discord Info object
        const discordInfo: DiscordInformation = new DiscordInformation(uuidv4(), userID, username, avatar, discriminator);

        console.log(discordInfo);

        const query: QueryObject = QueryBuilder.saveDiscordInfo(discordInfo);
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
            discordInfo = new DiscordInformation(result.token.toString(), result.user_id, result.username, result.avatar, result.discriminator)
        } catch(e) {
            console.error("Discord getDiscordInformation(): Database query threw exception");
            console.error(e);
        }

        if(!discordInfo) {
            console.error("Discord getDiscordInformation(): Couldn't get Discord Information");            
            return null;
        }

        return discordInfo;
    }

    public static async deleteDiscordInformation(token: string): Promise<boolean> {
        const query: QueryObject = QueryBuilder.deleteDiscordInfo(token);
        let successful: boolean = false;
        try {
            await ConnectToDatabaseService.executeQuery(query);
            successful = true;
        } catch(e) {
            console.error("Discord deleteDiscordInformation(): Database query threw exception");
            console.error(e);
        }

        if(!successful) {
            console.error("Discord deleteDiscordInformation(): Couldn't delete Discord information");
            return false;
        }

        return true;
    }
}