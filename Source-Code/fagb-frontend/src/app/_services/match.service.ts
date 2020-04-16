import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';
import { CookieService } from 'ngx-cookie-service';

import { MatchMakingRequest } from '../data_objects/matchmakingrequest';
import { PublicUser } from '../data_objects/publicuser';
import { Game } from '../data_objects/game';
import { NotifyMatch } from '../data_objects/notifymatch';
import { AbstractControl } from '@angular/forms';
import { MatchMakingResponse } from '../data_objects/matchmakingresponse';
import { ControlsMap } from '../_interface/controls-map';
import { DeleteMatchMakingRequest } from '../data_objects/deletematchmakingrequest';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  public currentMatchUsers: Observable<PublicUser[]>;
  public currentMatchGame: Observable<Game>;
  private urlS: string = '/matchmakingrequestendpoint';
  private urlN: string = '/notifymatchendpoint';
  private urlD: string = '/deleterequestendpoint';
  private currentGamer: PublicUser;

  // Users
  private currentMatchUsersSubject: BehaviorSubject<PublicUser[]>;

  // Game
  private currentMatchGameSubject: BehaviorSubject<Game>;

  public constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService
  ) {
    this.currentMatchUsersSubject = new BehaviorSubject<PublicUser[]>(null);
    this.currentMatchUsers = this.currentMatchUsersSubject.asObservable();

    this.currentMatchGameSubject = new BehaviorSubject<Game>(null);
    this.currentMatchGame = this.currentMatchGameSubject.asObservable();

    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  public searchMatch(gameData: ControlsMap<AbstractControl>, filterData: ControlsMap<AbstractControl>): Observable<MatchMakingResponse> {
    const sessionId = this.cookieService.get('gamer');
    const requestMatch = new MatchMakingRequest(
      sessionId,
      this.currentGamer.user_id,
      // first game_id of string array as num
      +gameData.game.value[1],
      filterData.playerParty.value,
      filterData.playerSearch.value,
      // String to bool
      filterData.playstyle.value === 'true' ? true : false
    );
    console.log(requestMatch);
    return this.http.post<MatchMakingResponse>(this.urlS, requestMatch);
  }

  public notifyMatch(requestId: number): Observable<MatchMakingResponse> {
    const notifyMatch = new NotifyMatch(requestId);
    return this.http.post<MatchMakingResponse>(this.urlN, notifyMatch)
      .pipe(map(data => {
        if (data && !!data.users) {
          const matchUseres: PublicUser[] = [];
          // tslint:disable-next-line: prefer-for-of
          for (let i = 0; i < data.users.length; i++) {
            matchUseres.push(new PublicUser(
              data.users[i].user_id,
              data.users[i].nickname,
              data.users[i].discord_tag,
              data.users[i].cake_day,
              data.users[i].region,
              null,
              null)
            );
          }
          this.currentMatchUsersSubject.next(matchUseres);

          this.currentMatchGameSubject.next(
            new Game(
              data.game.game_id,
              data.game.name,
              data.game.cover_link,
              data.game.game_description,
              data.game.publisher,
              data.game.published
            )
          );
        }
        console.log(data);
        return data;
      }));
  }

  public deleteRequest(): Observable<any> {
    const deleteMatchMakingRequest = new DeleteMatchMakingRequest (
      this.authenticationService.session.session_id,
      1
    );
    return this.http.post<any>(this.urlD, deleteMatchMakingRequest);
  }

  // this.authenticationService.session.session_id,

}
