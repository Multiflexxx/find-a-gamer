import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectToDatabaseService {

    databaseLogin: string;
    connection: any;

    constructor()
    {
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

    public getResult(query: string)
    {
        this.connection.query(query, function (error, results, fields) {
            if (error) throw error;
            console.log('The solution is: ', results);
          });
           
          this.connection.end();
    }
}