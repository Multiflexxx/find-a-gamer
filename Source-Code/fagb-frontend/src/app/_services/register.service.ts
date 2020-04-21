import * as bcrypt from 'bcryptjs';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';
import { Registration } from '../data_objects/registration';
import { Session } from '../data_objects/session';
import { ControlsMap } from '../_interface/controls-map';
import { DiscordInformation } from '../data_objects/discordinformation';
import { DiscordInfoRequest } from '../data_objects/discordinforequest';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private url: string = '/registrationendpoint';
  private urlD: string = '/discord-data';

  public constructor(private http: HttpClient, private cookieService: CookieService) { }

  public getDiscordData(token: string): Observable<DiscordInformation> {
    const discordInfoRequest: DiscordInfoRequest = new DiscordInfoRequest(
      token
    );
    return this.http.post<DiscordInformation>(this.urlD, discordInfoRequest);
  }

  public register(profileData: ControlsMap<AbstractControl>, gameData: ControlsMap<AbstractControl>, token: string): Observable<Session> {
    const games: Array<Game> = [];
    const gameids: Array<number> = JSON.parse(gameData.game.value);
    for (const gameid of gameids) {
      games.push(new Game(gameid));
    }
    const langs: Array<Language> = [];
    const langids: Array<number> = profileData.lang.value;
    for (const langid of langids) {
      langs.push(new Language(langid));
    }

    const region: Region = new Region(profileData.region.value);

    const hash: string = bcrypt.hashSync(profileData.password.value, '$2a$10$6SGv47p.FlJYI/WsYJKWle');

    const registration: Registration = new Registration(
      profileData.email.value,
      hash,
      profileData.name.value,
      profileData.tag.value,
      profileData.date.value,
      region,
      langs,
      games,
      token
    );

    return this.http.post<Session>(this.url, registration)
      .pipe(map(regGamer => {
        this.cookieService.set('gamer', regGamer.session_id);
        return regGamer;
      }));
  }
}
