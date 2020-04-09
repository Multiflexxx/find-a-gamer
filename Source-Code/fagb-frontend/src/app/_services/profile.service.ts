import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditProfileResponse } from '../data_objects/editprofileresponse';
import { PublicUser } from '../data_objects/publicuser';
import { ControlsMap } from '../_interface/controls-map';
import { AbstractControl } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url: string = '/profileupdateendpoint';
  private currentGamer: PublicUser;

  public constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  public updateProfile(profileUpdateValue: ControlsMap<AbstractControl>): void {
    // const games: Array<Game> = [];
    // const gameids: Array<number> = JSON.parse(profileUpdateValue.game.value);
    // for (const gameid of gameids) {
    //   games.push(new Game(gameid));
    // }
    const langs: Array<Language> = [];
    const langids: Array<number> = profileUpdateValue.lang.value;
    for (const langid of langids) {
      langs.push(new Language(langid));
    }

    const region: Region = new Region(profileUpdateValue.region.value);

    console.log(profileUpdateValue);
    const publicUser: PublicUser = new PublicUser(
      this.currentGamer.user_id,
      this.currentGamer.nickname,
      this.currentGamer.discord_tag,
      this.currentGamer.cake_day,
      region,
      this.currentGamer.games,
      langs,
      this.currentGamer.profile_picture,
      profileUpdateValue.biography.value
    );
    console.log(publicUser);
    // return this.http.post(this.url, User);
  }
}
