import { Language } from './language';
import { Game } from './game';

export class Registration {
    public email: string;
    public password_hash: string;
    public nickname: string;
    public discord_tag: string;
    public birthdate: Date;
    public region: string;
    public languages: Language[];
    public games: Game[];
}
