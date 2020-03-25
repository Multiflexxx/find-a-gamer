import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { Session } from "src/data_objects/session";
import { User } from "src/data_objects/user";
import { v4 as uuidv4 } from 'uuid';

export class SessionFactory {
    public static async getSessionBySessionId(session_id: string) {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.getSessionBySessionId(session_id);
            let session: Session;
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                result = callbackValue[0];
            }, function(callbackValue) {
                console.error("ConnectToToDatabaseService getPromise(): Promise rejected");
                console.error(callbackValue);
            });
    
            session = new Session(result.session_id.toString('utf8'), result.user_id, result.stay_logged_in, result.expiration_date);
            resolve(session);
        });
    }

    public static async getSessionByUser(user: User) {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.getSessionByUserId(user);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                result = callbackValue[0];
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(new Session(result.session_id.toString(), result.user_id, result.stay_logged_in, result.expiration_date));
        });
    }

    public static async createSessionForUser(user: User, stay_logged_in: boolean) {
        return new Promise(async function(resolve, reject) {
            let session_id = uuidv4();
            let query = QueryBuilder.createSession(session_id, user, stay_logged_in);
            let result;
            let session: Session;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                // successful
                result = callbackValue;
            }, function(callbackValue) {
                // unsuccessful
                reject("Couldn't create session");
                console.error(callbackValue);

            });

            await SessionFactory.getSessionBySessionId(session_id).then(function(callbackValue) {
                result = callbackValue;
                console.log("getSessionForUser");
                console.log(callbackValue);
            }, function(callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            })
            session = new Session(result.session_id, result.user_id, result.stay_logged_in, result.expiration_date);
            resolve(session);
        })
    }

    public static async deleteSessionByUser(user: User) {
        return new Promise(async function(resolve, reject) {
            let query = QueryBuilder.deleteSessionByUserId(user);
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue){
                resolve(callbackValue);
            }, function(callbackValue) {
                console.error("SessionFactory deleteSessionByUser(): Failed to delete Session");
                console.error(callbackValue);
                reject(callbackValue);
            });
        });
    }
}