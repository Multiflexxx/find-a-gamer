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
import { DeleteMatchMakingResponse } from '../data_objects/deletematchmakingresponse';
import { MatchHistoryResponse } from '../data_objects/matchhistoryresponse';
import { MatchHistoryRequest } from '../data_objects/matchhistoryrequest';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  public currentMatchMakingResponse: Observable<MatchMakingResponse>;

  private urlS: string = '/matchmakingrequestendpoint';
  private urlN: string = '/notifymatchendpoint';
  private urlD: string = '/deleterequestendpoint';
  private urlH: string = '/match-history';
  private compState: number;
  private currentGamer: PublicUser;

  // MatchMakingResponse
  private currentMatchMakingResponseSubject: BehaviorSubject<MatchMakingResponse>;

  public constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService
  ) {
    this.currentMatchMakingResponseSubject = new BehaviorSubject<MatchMakingResponse>(null);
    this.currentMatchMakingResponse = this.currentMatchMakingResponseSubject.asObservable();

    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  public setCompState(num: number): void {
    this.compState = num;
  }

  public getCompState(): number {
    return this.compState;
  }

  public searchMatch(gameData: ControlsMap<AbstractControl>, filterData: ControlsMap<AbstractControl>): Observable<MatchMakingResponse> {
    const sessionId = this.cookieService.get('gamer');
    const requestMatch = new MatchMakingRequest(
      sessionId,
      this.currentGamer.user_id,
      // first game_id of string array as num
      +gameData.game.value[1],
      filterData.playerSearch.value,
      filterData.playerParty.value,
      // String to bool
      filterData.playstyle.value === 'true' ? true : false
    );
    return this.http.post<MatchMakingResponse>(this.urlS, requestMatch);
  }

  public notifyMatch(requestId: number): Observable<MatchMakingResponse> {
    const notifyMatch = new NotifyMatch(requestId);
    return this.http.post<MatchMakingResponse>(this.urlN, notifyMatch)
      .pipe(map(data => {
        if (data && !!data.matchedUsers) {
          console.log(data);
          this.currentMatchMakingResponseSubject.next(data);
        }
        return data;
      }));
  }

  public deleteRequest(requestId: number): Observable<DeleteMatchMakingResponse> {
    const deleteMatchMakingRequest = new DeleteMatchMakingRequest(
      this.authenticationService.session.session_id,
      requestId
    );
    return this.http.post<DeleteMatchMakingResponse>(this.urlD, deleteMatchMakingRequest);
  }

  public getMatchHistory(): Observable<MatchHistoryResponse> {
    const sessionId = this.cookieService.get('gamer');

    const matchHistoryRequest = new MatchHistoryRequest(
      sessionId,
      this.currentGamer.user_id,
    );

    return this.http.post<MatchHistoryResponse>(this.urlH, matchHistoryRequest);
  }
}
