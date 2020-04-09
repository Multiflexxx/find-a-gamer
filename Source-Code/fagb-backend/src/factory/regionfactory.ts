import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { Region } from '../data_objects/region';
import { User } from '../data_objects/user';
import { QueryObject } from 'src/data_objects/queryobject';

export class RegionFactory {

    public static async getRegionById(id: number): Promise<Region> {
        let region: Region;
        let query = QueryBuilder.getRegionById(id);
        await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
            region = new Region(callbackValue[0].region_id, callbackValue[0].name);
        }, function (callbackValue) {
            console.error("ConnectToDatabaseService getPromise(): Promise rejected");
            console.error(callbackValue);
        });

        if(!region) {
            return null;
        }

        return region;
    }

    public static async getAllRegions(): Promise<Region[]> {
        let query: QueryObject = QueryBuilder.getRegions();
        let regions: Region[] = [];
        await ConnectToDatabaseService.getPromise(query).then(async function (callbackValue) {
            await callbackValue.forEach(region => {
                regions.push(new Region(region.region_id, region.name));
            });
        }, function (callbackValue) {
            console.error("ConnectToDatabaseService getPromise(): Failed to get regions from database");
            console.error(callbackValue);
        });

        if(!regions) {
            console.error("ConnectToDatabaseService getPromise(): Couldn't get regions");
            return null;
        }
        
        return regions;
    }

    // public static async getRegionByUser(user: User) {
    //     return new Promise(async function (resolve, reject) {
    //         let query = QueryBuilder.getR
    //     })
    // }
}