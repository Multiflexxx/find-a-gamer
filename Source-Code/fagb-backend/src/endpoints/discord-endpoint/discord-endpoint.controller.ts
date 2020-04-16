import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('discord')
export class DiscordEndpointController {
    @Get()
    public handleDiscordCallback(@Req() request: Request) {
        const CLIENT_ID = 700293853399351297;
        const CLIENT_SECRET = "fqbew8BAtOAozW274iZIww9_O5xGbsx_";
        const REDIRECT_URI = "http%3A%2F%2Flocalhost%3A3000%2Fdiscord";
        const code = request.query.code

        const url = "";
        const content = {
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'scope': 'identify'
        }

        // const response = await fetch(url, {
        //     method: 'POST',
        //     body: content,
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     }
        // })
    }
}
