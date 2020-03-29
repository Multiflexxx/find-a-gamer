import { Registration } from "./registration";

export class Game {
    public game_id: number;
    public name: string;
    public cover_link: string;
    public game_description: string;
    public publisher: string;
    public published: Date;

    public constructor(game_id: number, name?: string, cover_link?: string, game_description?: string, publisher?: string, published?: Date) {
        this.game_id = game_id;
        if (name) {
            this.name = name;
        } else {
            this.name = null;
        }

        if (cover_link) {
            this.cover_link = cover_link;
        } else {
            this.cover_link = null;
        }

        if (game_description) {
            this.game_description = game_description;
        } else {
            this.game_description = null;
        }

        if (publisher) {
            this.publisher = publisher;
        } else {
            this.publisher = null;
        }

        if (published) {
            this.published = published;
        } else {
            this.published = null;
        }
    }
}