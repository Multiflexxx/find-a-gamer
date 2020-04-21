import * as bcrypt from 'bcryptjs';

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
import { EditProfileRequest } from '../data_objects/editprofilerequest';
import { map } from 'rxjs/operators';
import { DeleteProfileRequest } from '../data_objects/deleteprofilerequest';
import { DeleteProfileResponse } from '../data_objects/deleteprofileresponse';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private url: string = '/profileupdateendpoint';
  private urlD: string = '/profiledeleteendpoint';
  private currentGamer: PublicUser;

  public constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  public updateProfile(profileUpdateValue: ControlsMap<AbstractControl>): Observable<EditProfileResponse> {
    const games: Array<Game> = [];
    const gameids: Array<number> = JSON.parse(profileUpdateValue.game.value);
    for (const gameid of gameids) {
      games.push(new Game(gameid));
    }

    const langs: Array<Language> = [];
    const langids: Array<number> = profileUpdateValue.lang.value;
    for (const langid of langids) {
      langs.push(new Language(langid));
    }

    const region: Region = new Region(profileUpdateValue.region.value);
    let publicUser: PublicUser = new PublicUser(
      this.currentGamer.user_id,
      this.currentGamer.nickname,
      this.currentGamer.discord_tag,
      this.currentGamer.cake_day,
      region,
      games,
      langs,
      this.currentGamer.profile_picture,
      profileUpdateValue.biography.value
    );

    if (publicUser.region.region_id === this.currentGamer.region.region_id
      && this.equalGame(publicUser.games, this.currentGamer.games)
      && this.equalLang(publicUser.languages, this.currentGamer.languages)
      && publicUser.biography === this.currentGamer.biography) {
      publicUser = null;
    }

    let oPassword: string = null;
    let nPassword: string = null;

    if (profileUpdateValue.oPassword.value !== '' && profileUpdateValue.nPassword.value !== '') {
      oPassword = bcrypt.hashSync(profileUpdateValue.oPassword.value, '$2a$10$6SGv47p.FlJYI/WsYJKWle');
      nPassword = bcrypt.hashSync(profileUpdateValue.nPassword.value, '$2a$10$6SGv47p.FlJYI/WsYJKWle');
    }

    const editprofileRequest: EditProfileRequest = new EditProfileRequest(
      this.authenticationService.session.session_id,
      publicUser,
      oPassword,
      nPassword
    );

    return this.http.post<EditProfileResponse>(this.url, editprofileRequest)
      .pipe(map(data => {
        if (data && data.successful) {
          this.authenticationService.currentGamerSubject.next(data.publicUser);
        }
        return data;
      }));
  }

  public deleteProfile(): Observable<DeleteProfileResponse> {

    const deleteProfileRequest: DeleteProfileRequest = new DeleteProfileRequest(
      this.authenticationService.session.session_id,
      this.currentGamer
    );

    return this.http.post<DeleteProfileResponse>(this.urlD, deleteProfileRequest)
      .pipe(map(data => {
        if (data && data.successful) {
          this.authenticationService.currentGamerSubject.next(data.publicUser);
        }
        return data;
      }));
  }

  private equalLang(nLangs: Array<Language>, oLangs: Array<Language>): boolean {
    if (nLangs.length !== oLangs.length) {
      return false;
    } else {
      for (const oLang of oLangs) {
        if (nLangs.findIndex(x => x.language_id === oLang.language_id) === -1) {
          return false;
        }
      }
      return true;
    }
  }

  private equalGame(nGames: Array<Game>, oGames: Array<Game>): boolean {
    if (nGames.length !== oGames.length) {
      return false;
    } else {
      for (const oLang of oGames) {
        if (nGames.findIndex(x => x.game_id === oLang.game_id) === -1) {
          return false;
        }
      }
      return true;
    }
  }
}
