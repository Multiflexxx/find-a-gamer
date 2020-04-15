import { QueryBuilder } from '../connecttodatabase/querybuilder';
import { ConnectToDatabaseService } from '../connecttodatabase/connecttodatabase.service';
import { Region } from '../data_objects/region';
import { User } from '../data_objects/user';
import { QueryObject } from 'src/data_objects/queryobject';

export class RegionFactory {

    public static async getRegionById(id: number): Promise<Region> {
        let region: Region;
        const query = QueryBuilder.getRegionById(id);
        try {
            const result: any = (await ConnectToDatabaseService.executeQuery(query))[0];
            region = new Region(result.region_id, result.name);
        } catch (e) {
            console.error('regionFactory getRegionById(): Database Query threw Exception');
            console.error(e);
        }

        if(!region) {
            console.error('regionFactory getRegionById(): Couldn\'t get Region');
            return null;
        }

        return region;
    }

    public static async getAllRegions(): Promise<Region[]> {
        const query: QueryObject = QueryBuilder.getRegions();
        const regions: Region[] = [];
        try {
            const result: any[] = await ConnectToDatabaseService.executeQuery(query);
            result.forEach(region => {
                regions.push(new Region(region.region_id, region.name));
            });
        } catch (e) {
            console.error('RegionFactory getAllRegions(): Database Query threw Exception');
            console.error(e);
        }

        if(!regions) {
            console.error('RegionFactory getAllRegions(): Couldn\'t get regions');
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