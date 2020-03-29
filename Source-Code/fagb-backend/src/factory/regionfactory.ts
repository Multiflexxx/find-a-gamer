import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { Region } from '../data_objects/region';
import { User } from 'src/data_objects/user';

export class RegionFactory {

    public static async getRegionById(id: number): Promise<Region> {
        return new Promise(async function (resolve, reject) {
            let result;
            let query = QueryBuilder.getRegionById(id);
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                result = callbackValue[0];
            }, function (callbackValue) {
                console.error("ConnectToDatabaseService getPromise(): Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });
            resolve(new Region(result.region_id, result.name));
        });
    }

    public static async getAllRegions(): Promise<Region[]> {
        return new Promise(async function (resolve, reject) {
            let result;
            let regions: Region[] = [];
            await ConnectToDatabaseService.getPromise(QueryBuilder.getRegions()).then(function (callbackValue) {
                result = callbackValue;
            }, function (callbackValue) {
                console.error("ConnectToDatabaseService getPromise(): Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });
            result.forEach(region => {
                regions.push(new Region(region.region_id, region.name));
            });
            resolve(regions);
        });
    }

    // public static async getRegionByUser(user: User) {
    //     return new Promise(async function (resolve, reject) {
    //         let query = QueryBuilder.getR
    //     })
    // }
}