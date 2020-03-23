import { Injectable } from '@nestjs/common';
import { QueryObject } from 'src/data_objects/queryobject';

// See https://www.npmjs.com/package/mysql

@Injectable()
export class ConnectToDatabaseService {

    static databaseLogin: string = '../../databaseLogin.json';

    public static getConnection() {
        let mysql = require('mysql');
        const databaseLoginData = require(ConnectToDatabaseService.databaseLogin);

        return mysql.createConnection({
            host: databaseLoginData.host,
            port: databaseLoginData.port,
            user: databaseLoginData.user,
            password: databaseLoginData.password,
            database: databaseLoginData.database
        });
    }

    public static async getPromise(queryObject: QueryObject): Promise<any> {
        return new Promise(function(resolve, reject) {
            let c = ConnectToDatabaseService.getConnection();
            c.query(queryObject.createQueryObject(), function (error, results, fields) {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve(results);
            });
            c.end();
        });

        // let myPromise = new Promise(function (resolve, reject) {
        //     let c = ConnectToDatabaseService.getConnection();
        //     c.query(queryObject.createQueryObject(), function (error, results, fields) {
        //         if (error) {
        //             reject(error);
        //             throw error;
        //         }
        //         resolve(results);
        //     });
        //     c.end();
        // });

        // await myPromise.then(function(callbackValue) {
        //     return callbackValue;
        // }, function(callbackValue) {
        //     console.error("ConnectToDatabaseService getResult(): Promise<any> rejected");
        //     console.error(callbackValue);
        //     return null; // TBD: Error Object
        // })
    }
}