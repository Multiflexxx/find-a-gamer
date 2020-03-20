import { Injectable } from '@nestjs/common';

// See https://www.npmjs.com/package/mysql

@Injectable()
export class ConnectToDatabaseService {

    databaseLogin: string;
    connection: any;

    constructor() {
        var mysql = require('mysql');
        const databaseLoginData = require('../../databaseLogin.json');

        // establish connection to database
        this.connection = mysql.createConnection({
            host: databaseLoginData.host,
            port: databaseLoginData.port,
            user: databaseLoginData.user,
            password: databaseLoginData.password,
            database: databaseLoginData.database
        });

        this.connection.connect();
    }

    public getResult(query: string): any {
        var queryResults: any[];

        this.connection.query(query, function (error, results, fields) {
            if (error) {
                throw error;
            }

            queryResults = results;
        });

        return queryResults;
    }

    public executeQuery(query: string): void {
        this.getResult(query);
    }

    public closeConnetion() {
        this.connection.end();
    }
}