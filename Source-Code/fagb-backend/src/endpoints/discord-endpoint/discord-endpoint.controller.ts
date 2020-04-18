import { Controller, Get, Req, HttpModule, HttpService, Res } from '@nestjs/common';
import { Request, Router, Response } from 'express';
import * as Discord from 'discord.js';

let fetch = require('node-fetch');
// import { btoa} from 'btoa';

@Controller('discord')
export class DiscordEndpointController {
    @Get()
    public async handleDiscordCallback(@Res() res: Response, @Req() request: Request) {

        const CLIENT_ID = "700293853399351297";
        const CLIENT_SECRET = "fqbew8BAtOAozW274iZIww9_O5xGbsx_";
        const REDIRECT_URI = encodeURIComponent("http://localhost:3000/discord");
        const CODE = request.query.code

        const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"); //btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        

        console.log(CODE);


        // URL for redirect to discord
        // https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}

       

        // GET Data from Discord after user has authorized
        // const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
        // {
        //     method: 'POST',
        //     headers: {
        //       Authorization: `Basic ${creds}`,
        //     },
        //   });
        // const json = await response.json();

        let url = `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}`;

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            }
        });

        const json = await response.json();

        url = `http://discordapp.com/api/users/@me`
        response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${json.access_token}`,
            }
        });
        
        console.log(await response.json());

        // Send back Successful and Token 
        
        return res.redirect('/register?test=1234');
        
        // const content = {
        //     'client_id': CLIENT_ID,
        //     'client_secret': CLIENT_SECRET,
        //     'grant_type': 'authorization_code',
        //     'code': code,
        //     'redirect_uri': REDIRECT_URI,
        //     'scope': 'identify'
        // }


        // const headers = {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        // }

        // let res = await http.post(
        //     url,
        //     content,
        //     {
        //         timeout: 40000,
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded'
        //         }
        //     }
        // );

        // await res.subscribe(async (data) => {
        //     return
        // });


    }
}
