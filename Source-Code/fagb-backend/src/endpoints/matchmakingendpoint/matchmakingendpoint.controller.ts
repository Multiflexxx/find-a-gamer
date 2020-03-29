import { Controller, Body, Get } from '@nestjs/common';
import { MatchMakingRequest } from 'src/data_objects/matchmakingrequest';

@Controller('matchmakingendpoint') 
export class MatchMakingEndpointController {
    @Get()
    async handleMatchMakingRequest(@Body() matchMakingRequest: MatchMakingRequest) {
        
    }
}