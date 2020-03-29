import { Region } from "./region";
import { Game } from "./game";
import { Language } from "./language";

export class PublicUser {
    user_id: number;
    nickname: string;
    discord_tag: string;
    profile_picture: string;
    cake_day: Date;
    biography: string;
    region: Region;
    games: Game[];
    languages: Language[];

    public constructor(user_id: number, nickname: string, discord_tag: string, cake_day: Date, region: Region, games: Game[], languages: Language[], profile_picture?: string, biography?: string) {
        this.user_id = user_id;
        this.nickname = nickname;
        this.discord_tag = discord_tag;
        this.cake_day = cake_day;
        this.region = region;
        this.games = games;
        this.languages = languages;

        if (biography) {
            this.biography = biography;
        }
        if (profile_picture) {
            this.profile_picture = profile_picture;
        }
    }
}