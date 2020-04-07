import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Registration } from '../data_objects/registration';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';

import { Session } from '../data_objects/session';

import { CookieService } from 'ngx-cookie-service';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url: string = 'http://localhost:3000/registrationendpoint';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(profileData, gameData) {
    const games: Array<Game> = [];
    console.log(gameData.game.value);
    const gameids: Array<number> = JSON.parse(gameData.game.value);
    for (const gameid of gameids) {
      games.push(new Game(gameid));
    }
    // for (let i = 0; i < gameids.length; i++) {
    //   games.push(new Game(gameids[i]));
    // }
    const langs: Array<Language> = [];
    console.log(profileData.lang.value);
    const langids: Array<number> = profileData.lang.value;
    for (const langid of langids) {
      langs.push(new Language(langid));
    }
    // for (let i = 0; i < langids.length; i++) {
    //   langs.push(new Language(langids[i]));
    // }

    const region: Region = new Region(profileData.region.value);

    const registration: Registration = new Registration(
      profileData.email.value,
      profileData.password.value,
      profileData.name.value,
      profileData.tag.value,
      profileData.date.value,
      region,
      langs,
      games
    );

    // registration.birthdate.toJSON;
    console.log(registration);
    console.log(JSON.stringify(registration));

    return this.http.post<Session>(this.url, registration)
      .pipe(map(regGamer => {
        this.cookieService.set('gamer', regGamer.session_id);
        return regGamer;
      }));
  }
}
