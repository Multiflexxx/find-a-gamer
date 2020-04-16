import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { RegionFactory } from '../../factory/regionfactory';
import { Region } from '../../data_objects/region';

@Controller('regionendpoint')
export class RegionEndpointController {
    @Get()
    public async getAllRegionsEndpoint(): Promise<Region[]> {
        const regions: Region[] = await RegionFactory.getAllRegions();

        if(!regions) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Couldn\'t get regions'
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        return regions;
    }
}
