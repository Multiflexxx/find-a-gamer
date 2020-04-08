import { ConnectToDatabaseService } from "../connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "../connecttodatabase/querybuilder";
import { Session } from "../data_objects/session";
import { User } from "../data_objects/user";
import { v4 as uuidv4 } from 'uuid';
import { QueryObject } from "src/data_objects/queryobject";

export class SessionFactory {
    public static async getSessionBySessionId(session_id: string): Promise<Session> {
        let query: QueryObject = QueryBuilder.getSessionBySessionId(session_id);
        let session: Session;

        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            session = new Session(callbackValue[0].session_id.toString('utf8'), callbackValue[0].user_id, callbackValue[0].stay_logged_in, callbackValue[0].expiration_date);
        }, function (callbackValue) {
            console.error("SessionFactory getSessionBySessionId(): Couldn't get Session");
            console.error(callbackValue);
        });

        if (!session) {
            console.error("SessionFactory getSessionBySessionId(): No Session with that ID: " + session_id);
            return null;
        }

        return session
    }

    // public static async getSessionBySessionId2(session_id: string) {
    //     let query = QueryBuilder.getSessionBySessionId(session_id);
    //     let session: Session;
    //     let result;
    //     await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
    //         result = callbackValue[0];
    //     }, function (callbackValue) {
    //         console.error("SessionFactory getSessionBySessionId(): Couldn't get Session");
    //         console.error(callbackValue);
    //     });

    //     if (!result) {
    //         console.error()
    //         return null;
    //     }

    //     return new Session(result.session_id, result.user_id, result.stay_logged_in, result.stay_logged_in);
    // }

    public static async getSessionByUser(user: User): Promise<Session> {
        let query: QueryObject = QueryBuilder.getSessionByUserId(user);
        let session: Session;

        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            session = new Session(callbackValue[0].session_id.toString('utf8'), callbackValue[0].user_id, callbackValue[0].stay_logged_in, callbackValue[0].expiration_date);
        }, function (callbackValue) {
            console.error("SessionFactory getSessionByUser(): Couldn't get session for user");
        });

        if (!session) {
            console.error("SessionFactory getSessionByUser(): Failed to get session for User");
            return null;
        }

        return session;
    }

    public static async createSessionForUser(user: User, stay_logged_in: boolean): Promise<Session> {
        let session_id = uuidv4();
        let query: QueryObject = QueryBuilder.createSession(session_id, user, !stay_logged_in ? false : true);
        let successful: boolean;

        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error("SessionFactory createSessionForUser(): Database failed to create Session");
            console.error(callbackValue);
        });

        if (!successful) {
            console.error("Session createSessionForUser(): Couldn't create session");
            return null
        }


        let session: Session = await SessionFactory.getSessionBySessionId(session_id)
        if (!session) {
            console.error("Session createSessionForUser(): Couldn't get created Session");
            return null;
        }

        return session;
    }

    public static async deleteSessionByUser(user: User): Promise<boolean> {
        let query: QueryObject = QueryBuilder.deleteSessionByUserId(user);
        let successful: boolean = false;

        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            successful = true;
        }, function (callbackValue) {
            console.error("SessionFactory deleteSessionByUser(): Database failed to delete Session");
            console.error(callbackValue);
        });

        if(!successful) {
            console.error("SessionFactory deleteSessionByUser(): Couldn't delete Session");
            return false;
        }

        return true;
    }

    // public static delay(ms: number) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }


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