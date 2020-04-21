import { Controller, Post, Body, HttpException, HttpStatus, Get } from '@nestjs/common';
import { DiscordInformation } from '../../data_objects/discordinformation';
import { Discord } from '../../factory/discord';
import { DiscordInfoRequest } from '../../data_objects/discordinforequest';

@Controller('discord-data')
export class DiscordDataController {
    @Post()
    public async getDiscordData(@Body() request: DiscordInfoRequest): Promise<DiscordInformation> {
        // token = "1918e40e-05da-4687-94e9-2aadda531dd8";
        // Validate token format
        if(!request.token ||request.token.length < 36 || !(new RegExp('([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})').test(request.token))) {
            throw new HttpException({
                status: HttpStatus.NOT_ACCEPTABLE,
                error: "Invalid token"
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        // Get discord Info
        let discordInfo: DiscordInformation = await Discord.getDiscordInformation(request.token);
        if(!discordInfo) {
            throw new HttpException({
                status: HttpStatus.INTERNAL_SERVER_ERROR,
                error: "Couldn't get Information"
            }, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return discordInfo;
    }
}
