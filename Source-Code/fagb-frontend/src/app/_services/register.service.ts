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

  url = 'http://localhost:3000/registrationendpoint';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(profileData, gameData) {
    var games: Array<Game> = [];
    console.log(gameData.game.value);
    var gameids: Array<number> = JSON.parse(gameData.game.value);
    for (let i = 0; i < gameids.length; i++) {
      games.push(new Game(gameids[i]));
    }

    var langs: Array<Language> = [];
    console.log(profileData.lang.value);
    var langids: Array<number> = profileData.lang.value;
    for (let i = 0; i < langids.length; i++) {
      langs.push(new Language(langids[i]));
    }

    var region: Region = new Region(profileData.region.value);

    var registration: Registration = new Registration(
      profileData.email.value,
      profileData.password.value,
      profileData.name.value,
      profileData.tag.value,
      profileData.date.value,
      region,
      langs,
      games
    );

    registration.birthdate.toJSON;
    console.log(registration);
    console.log(JSON.stringify(registration));

    return this.http.post<Session>(this.url, registration)
      .pipe(map(regGamer => {
        this.cookieService.set('gamer', regGamer.session_id);
        return regGamer;
      }))
  }
}
