import { Controller, Get } from '@nestjs/common';
import { RegionFactory } from '../../factory/regionfactory';

@Controller('regionendpoint')
export class RegionEndpointController {
    @Get()
    public async getAllRegionsEndpoint() {
        let regions;
        await RegionFactory.getAllRegions().then(function(callbackValue) {
            regions = callbackValue;
        }, function(callbackValue) {
            console.error("DataendpointController getAllRegionsEndpoint(): Couldn't get all Regions");
            console.error(callbackValue);
        });

        return regions;
    }
}
