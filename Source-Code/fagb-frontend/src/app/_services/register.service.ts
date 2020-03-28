import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Registration } from '../data_objects/registration';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  url = 'http://localhost:3000/registrationendpoint';

  constructor(private http: HttpClient) { }

  register(profileData, gameData) {
    var games: Array<Game> = [];
    var gameids: Array<number> = JSON.parse(gameData.gameCtrl);
    for (let i = 0; i < gameids.length; i++) {
      games.push(new Game(gameids[i]));
    }

    var langs: Array<Language> = [];
    for (let i = 0; i < profileData.langCtrl.length; i++) {
      langs.push(new Language(profileData.langCtrl[i]));
    }

    var region: Region = new Region(profileData.regionCtrl);

    var registration: Registration = new Registration(
      profileData.mailCtrl,
      profileData.passCtrl,
      profileData.nameCtrl,
      profileData.tagCtrl,
      profileData.dateCtrl,
      region,
      langs,
      games
    );

    registration.birthdate.toJSON;
    console.log(registration);
    console.log(JSON.stringify(registration));


    return this.http.post(this.url, registration);
  }
}
