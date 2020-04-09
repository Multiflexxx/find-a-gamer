import { Injectable } from '@nestjs/common';
import { QueryObject } from '../data_objects/queryobject';

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
    }

    /**
     * Not Type Safe because it cant be
     * @param queryObject 
     */
    public static async executeQuery(queryObject: QueryObject): Promise<any> {
        let c = ConnectToDatabaseService.getConnection();
        let err;
        let result;
        let field;
        await c.query(queryObject.createQueryObject(), function (error, results, fields) {
            if (error) {
                err = error;
            }
            field = fields;
            result = results;
        });
        c.end();
        if(err) {
            throw err;
        }
        return result;
    } 

    public static async testQuery(query: String) {
        return new Promise(function(resolve, reject) {
            let c = ConnectToDatabaseService.getConnection();
            c.query(query, function (error, results, fields) {
                if (error) {
                    reject(error);
                    throw error;
                }
                resolve(results);
            });
            c.end();
        })
    }
}