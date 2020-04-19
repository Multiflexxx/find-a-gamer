import { Controller, Get, Req, HttpModule, HttpService, Res } from '@nestjs/common';
import { Request, Router, Response } from 'express';
import * as Discord from 'discord.js';

let fetch = require('node-fetch');
// import { btoa} from 'btoa';

@Controller('discord')
export class DiscordEndpointController {
    @Get()
    public async handleDiscordCallback(@Res() res: Response, @Req() request: Request) {

        const path: string = "../../../databaseLogin.json";
        const discord: any = require(path);

        const CLIENT_ID = discord.client_id;
        const CLIENT_SECRET = discord.client_secret;
        const REDIRECT_URI = encodeURIComponent(discord.redirect_uri);
        const CODE = request.query.code

        const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"); 



        const tokenUrl: string = discord.discord_token_uri + `?grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}`;

        let response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            }
        });

        const ACCESS_TOKEN = await response.json().access_token;

        const UsersUrl = discord.discord_users_uri;
        response = await fetch(UsersUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            }
        });


        // If response is successful create temp DB entries and create token for frontend
        
        
        console.log(await response.json());

        // Send back Successful and Token 
        
        return res.redirect('/register?test=1234');

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
