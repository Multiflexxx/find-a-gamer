import { Region } from "./region";
import { Game } from "./game";
import { Language } from "./language";

export class User {
    public user_id: number;
    public email: string;
    public password_hash: string;
    public nickname: string;
    public discord_tag: string;
    public profile_picture: string;
    public cake_day: Date;
    public birthdate: Date;
    public biography: string;
    public region: Region;
    public languages: Language[];
    public games: Game[];


    public constructor (user_id: number, email: string, password_hash: string, nickname: string, discord_tag: string, profile_picture: string, cake_day: Date, birthdate: Date, biography: string, region: Region, games?: Game[], languages?: Language[]) {
        this.user_id = user_id;
        this.email = email;
        this.password_hash = password_hash;
        this.nickname = nickname;
        this.discord_tag = discord_tag;
        this.profile_picture = profile_picture;
        this.cake_day = cake_day;
        this.birthdate = birthdate;
        this.biography = biography;
        this.region = region;

        if(games) {
            this.games = games;
        }

        if(languages) {
            this.languages = languages;
        }
    }
}