import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { Session } from "src/data_objects/session";
import { User } from "src/data_objects/user";
import { v4 as uuidv4 } from 'uuid';

export class SessionFactory {
    public static async getSessionBySessionId(session_id: string): Promise<Session> {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getSessionBySessionId(session_id);
            let session: Session;
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("SessionFactory getSessionBySessionId(): Couldn't get Session");
                console.error(callbackValue);
            });

            if (!result) {
                console.error("SessionFactory getSessionBySessionId(): No Session with that ID: " + session_id);
                reject(false);
                return;
            }

            session = new Session(result.session_id.toString('utf8'), result.user_id, result.stay_logged_in, result.expiration_date);
            resolve(session);
        });
    }

    public static async getSessionBySessionId2(session_id: string) {
        let query = QueryBuilder.getSessionBySessionId(session_id);
        let session: Session;
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            result = callbackValue[0];
        }, function (callbackValue) {
            console.error("SessionFactory getSessionBySessionId(): Couldn't get Session");
            console.error(callbackValue);
        });

        if (!result) {
            console.error()
            return null;
        }

        return new Session(result.session_id, result.user_id, result.stay_logged_in, result.stay_logged_in);
    }

    public static async getSessionByUser(user: User) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.getSessionByUserId(user);
            let result;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error(callbackValue);
                reject(callbackValue);
            })
            resolve(new Session(result.session_id.toString(), result.user_id, result.stay_logged_in, result.expiration_date));
        });
    }

    public static async createSessionForUser(user: User, stay_logged_in: boolean) {
        return new Promise(async function(resolve, reject) {
            let session_id = uuidv4();
            let query = QueryBuilder.createSession(session_id, user, !stay_logged_in ? false : true);
            let session: Session;
            let successful;
            await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
                // successful
                successful = true;
            }, function(callbackValue) {
                // unsuccessful
                reject("SessionFactory createSessionForUser(): Database failed to create Session");
                console.error(callbackValue);
            });
            console.log(user);
            console.log(query);
            console.log(session_id);
            console.log(successful);

            if(!successful) {
                console.error("Session createSessionForUser(): Couldn't create session");
                reject(false);
                return;
            }

            // await SessionFactory.delay(1000);

            let result;
            await SessionFactory.getSessionBySessionId(session_id).then(function(callbackValue) {
                result = callbackValue;
                console.log("getSessionForUser");
                console.log(callbackValue);
            }, function(callbackValue) {
                // console.log(query);
                // console.log(session_id);
                console.error("SessionFactory createSessionForUser(): Couldn't get Session");
                reject(callbackValue);
            });

            if(!result) {
                return;
            }

            session = new Session(result.session_id, result.user_id, result.stay_logged_in, result.expiration_date);
            resolve(session);
        });
    }

    public static async deleteSessionByUser(user: User) {
        return new Promise(async function (resolve, reject) {
            let query = QueryBuilder.deleteSessionByUserId(user);
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                // console.log("In Delete Session By User");
                // console.log(query);
                resolve(callbackValue);
            }, function (callbackValue) {
                console.error("SessionFactory deleteSessionByUser(): Failed to delete Session");
                console.error(callbackValue);
                reject(callbackValue);
            });
        });
    }

    public static delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    // public static async createSessionForUser(user: User, stay_logged_in: boolean) {
    //     return new Promise(async function (resolve, reject) {
    //         let session_id = uuidv4();
    //         let query = QueryBuilder.createSession(session_id, user, !stay_logged_in ? false : true);
    //         let session: Session;
    //         let result;
    //         await ConnectToDatabaseService.getPromise(query).then(async function (callbackValue) {
    //             // successful
    //             // successful = true;

    //             await SessionFactory.getSessionBySessionId(session_id).then(function (callbackValue) {
    //                 result = callbackValue;
    //                 console.log("getSessionForUser");
    //                 console.log(callbackValue);
    //             }, function (callbackValue) {
    //                 // console.log(query);
    //                 // console.log(session_id);
    //                 console.error("SessionFactory createSessionForUser(): Couldn't get Session");
    //                 reject(callbackValue);
    //             });

    //         }, function (callbackValue) {
    //             // unsuccessful
    //             reject("SessionFactory createSessionForUser(): Database failed to create Session");
    //             console.error(callbackValue);
    //         });
    //         console.log(user);
    //         console.log(query);
    //         console.log(session_id);
    //         // console.log(successful);

    //         // if (!successful) {
    //         //     console.error("Session createSessionForUser(): Couldn't create session");
    //         //     reject(false);
    //         //     return;
    //         // }

    //         // await SessionFactory.delay(1000);

    //         // let result;
    //         // await SessionFactory.getSessionBySessionId(session_id).then(function(callbackValue) {
    //         //     result = callbackValue;
    //         //     console.log("getSessionForUser");
    //         //     console.log(callbackValue);
    //         // }, function(callbackValue) {
    //         //     // console.log(query);
    //         //     // console.log(session_id);
    //         //     console.error("SessionFactory createSessionForUser(): Couldn't get Session");
    //         //     reject(callbackValue);
    //         // });

    //         if (!result) {
    //             return;
    //         }

    //         session = new Session(result.session_id, result.user_id, result.stay_logged_in, result.expiration_date);
    //         resolve(session);
    //     });
    // }
}