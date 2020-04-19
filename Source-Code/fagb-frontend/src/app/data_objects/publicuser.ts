import { Region } from './region';
import { Game } from './game';
import { Language } from './language';

export class PublicUser {
    public user_id: number;
    public nickname: string;
    public discord_tag: string;
    public profile_picture: string;
    public cake_day: Date;
    public biography: string;
    public region: Region;
    public games: Game[];
    public languages: Language[];

    public constructor(user_id: number, nickname: string, discord_tag: string, cake_day: Date, region: Region, games: Game[], languages: Language[], profile_picture?: string, biography?: string) {
        this.user_id = user_id;
        this.nickname = nickname;
        this.discord_tag = discord_tag;
        this.cake_day = cake_day;
        this.region = region;
        this.games = games;
        this.languages = languages;

        if (!biography || biography.length === 0) {
            this.biography = '';
        } else {
            this.biography = biography;
        }
        if (!profile_picture) {
            this.profile_picture = null;
        } else {
            this.profile_picture = profile_picture;
        }
    }
}
