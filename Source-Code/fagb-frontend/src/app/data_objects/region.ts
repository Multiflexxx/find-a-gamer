export class Region {
    public region_id: number;
    public name: string;

    public constructor(region_id: number, name?: string) {
        this.region_id = region_id;
        if (name) {
            this.name = name;
        }
    }
}
