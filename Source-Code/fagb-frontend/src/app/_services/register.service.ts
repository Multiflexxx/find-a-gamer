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

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private url: string = '/registrationendpoint';
  private urlD: string = '/discord-data';

  public constructor(private http: HttpClient, private cookieService: CookieService) { }

  public getDiscordData(token: string): Observable<DiscordInformation> {
    return this.http.post<DiscordInformation>(this.urlD, token);
  }

  public register(profileData: ControlsMap<AbstractControl>, gameData: ControlsMap<AbstractControl>): Observable<Session> {
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

    const discordToken: string = 'f961c7ff-f79c-4b13-9f8d-6e69a76c72e7';

    const registration: Registration = new Registration(
      profileData.email.value,
      profileData.password.value,
      profileData.name.value,
      profileData.tag.value,
      profileData.date.value,
      region,
      langs,
      games,
      discordToken
    );

    return this.http.post<Session>(this.url, registration)
      .pipe(map(regGamer => {
        this.cookieService.set('gamer', regGamer.session_id);
        return regGamer;
      }));
  }
}
