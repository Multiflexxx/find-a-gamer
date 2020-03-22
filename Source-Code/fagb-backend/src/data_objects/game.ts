import { Registration } from "./registration";

export class Game {
    public game_id: number;
    public name: string;
    public cover_link: string;
    public game_description: string;
    public publisher: string;
    public published: Date;

    public constructor (game_id: number, name?: string, cover_link?: string, game_description?: string, publisher?: string, published?: Date) {
        this.game_id = game_id;
        if(name && cover_link && game_description && publisher && published) {
            this.name = name;
            this.cover_link = cover_link;
            this.game_description = game_description;
            this.publisher = publisher;
            this.published = published;
        }
    }
}