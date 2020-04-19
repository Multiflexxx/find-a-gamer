import { Controller, Get, Req, HttpModule, HttpService, Res, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Router, Response } from 'express';
import { Discord } from 'src/factory/discord';


let fetch = require('node-fetch');
// import { btoa} from 'btoa';

@Controller('discord')
export class DiscordEndpointController {
    @Get()
    public async handleDiscordCallback(@Res() res: Response, @Req() request: Request) {

        const path: string = "../../../discordAPI.json";
        const discord: any = await require(path);

        const CLIENT_ID = discord.client_id;
        const CLIENT_SECRET = discord.client_secret;
        const REDIRECT_URI = encodeURIComponent(discord.redirect_uri);
        const CODE = request.query.code

        const creds = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"); 
        const tokenUrl: string = discord.discord_token_uri + `?grant_type=authorization_code&code=${CODE}&redirect_uri=${REDIRECT_URI}`;

        console.log(tokenUrl);

        // Get access token from discord
        let response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${creds}`,
            }
        });

        // Read response with json
        let responseJSON = await response.json();
        const ACCESS_TOKEN = responseJSON.access_token;

        // Fetch User Info from discord
        const UsersUrl = discord.discord_users_uri;
        response = await fetch(UsersUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            }
        });
        responseJSON = await response.json();
        console.log(responseJSON);


        // If response is successful create temp DB entries and create token for frontend
        const token: string = await Discord.saveDiscordInformation(responseJSON.id, responseJSON.username, responseJSON.avatar, responseJSON.discriminator);

        if(!token) {
            throw new HttpException({
                error: "Couldn't process data",
                status: HttpStatus.INTERNAL_SERVER_ERROR
            }, HttpStatus.INTERNAL_SERVER_ERROR)
        }

        // Send back Successful and Token 
        return res.redirect(`/register?successful=true&token=${token}`);

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
