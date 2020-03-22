export class Language {
    public language_id: number;
    public name: string;
    public language_code: string;

    public constructor(language_id: number, name?: string, language_code?: string) {
        this.language_id = language_id;
        if (name && language_code) {
            this.name = name;
            this.language_code = language_code;
        }
    }
}
