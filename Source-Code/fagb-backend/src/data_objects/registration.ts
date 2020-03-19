import { Language } from './language';
import { Game } from './game';

export class Registration {
    email: string;
    password_hash: string;
    nickname: string;
    discord_tag: string;
    birthdate: Date;
    region: string;
    languages: Language[];
    games: Game[];
}
