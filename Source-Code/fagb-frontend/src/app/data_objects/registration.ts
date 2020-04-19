import { Language } from './language';
import { Game } from './game';
import { Region } from './region';

export class Registration {
    public email: string;
    public password_hash: string;
    public nickname: string;
    public discord_tag: string;
    public birthdate: Date;
    public region: Region;
    public languages: Language[];
    public games: Game[];
    public discordToken: string;

    public constructor(email: string, password_hash: string, nickname: string, discord_tag: string, birthdate: Date, region: Region, languages: Language[], games: Game[], discordToken: string) {
        this.email = email;
        this.password_hash = password_hash;
        this.nickname = nickname;
        this.discord_tag = discord_tag;
        this.birthdate = birthdate;
        this.region = region;
        this.languages = languages;
        this.games = games;
        this.discordToken = discordToken;
    }
}
