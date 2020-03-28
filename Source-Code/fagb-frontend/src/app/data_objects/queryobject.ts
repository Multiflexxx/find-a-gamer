export class QueryObject {
    query: string;
    parameter: any[];
    constructor(query: string, parameter?: any) {
        this.query = query;
        if(parameter) {
            this.parameter = parameter;
        }
    }

    public createQueryObject() {
        if(this.parameter) {
            return {
                sql: this.query,
                values: this.parameter
            }
        } else {
            return {
                sql: this.query,
            }
        }
    }
}
