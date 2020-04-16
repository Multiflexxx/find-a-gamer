export class QueryObject {
    public query: string;
    public parameter: any[];
    public constructor(query: string, parameter?: any) {
        this.query = query;
        if (parameter) {
            this.parameter = parameter;
        }
    }

    public createQueryObject(): any {
        if (this.parameter) {
            return {
                sql: this.query,
                values: this.parameter
            };
        } else {
            return {
                sql: this.query,
            };
        }
    }
}
