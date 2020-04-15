import { Injectable } from '@nestjs/common';
import { QueryObject } from '../data_objects/queryobject';

// See https://www.npmjs.com/package/mysql

@Injectable()
export class ConnectToDatabaseService {

    public static databaseLogin: string = '../../databaseLogin.json';

    public static getConnection(): any {
        const mysql = require('mysql');
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
        return new Promise((resolve, reject) => {
            const c = ConnectToDatabaseService.getConnection();
            c.query(queryObject.createQueryObject(), (error, results, fields) => {
                if (error) {
                    reject(error);
                    // throw error;
                }
                resolve(results);
            });
            c.end();
        });
    }

    /**
     * Not Type Safe because it cant be
     * @param queryObject Query to be executed as QueryObject (to enable escaping and SQl-Injection Protection)
     */
    public static async executeQuery(queryObject: QueryObject): Promise<any[]> {
        // let c = ConnectToDatabaseService.getConnection();
        // let outerError;
        // let outerResults;
        // let outerFields;
        // await c.query(queryObject.createQueryObject(), async function (error, results, fields) {
        //     if (error) {
        //         outerError = error;
        //     }
        //     outerFields = fields;
        //     outerResults = results;
        //     console.log(outerResults);
        // });
        // c.end();
        // if(outerError) {
        //     throw outerError;
        // }
        // console.log(outerResults);
        // return outerResults;
        let result;
        await ConnectToDatabaseService.getPromise(queryObject).then(callbackValue => {
            result = callbackValue;
        }, err => {
            throw err;
        });
        return result;
    }

    // public static async testQuery(query: String) {
    //     return new Promise(function(resolve, reject) {
    //         const c = ConnectToDatabaseService.getConnection();
    //         c.query(query, function (error, results, fields) {
    //             if (error) {
    //                 reject(error);
    //                 throw error;
    //             }
    //             resolve(results);
    //         });
    //         c.end();
    //     })
    // }
}