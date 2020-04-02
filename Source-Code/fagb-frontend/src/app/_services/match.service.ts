import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';

import { MatchMakingRequest } from '../data_objects/matchmakingrequest';
import { PublicUser } from '../data_objects/publicuser';

import { NotifyMatch } from '../data_objects/notifymatch';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private urlS: string = 'http://localhost:3000/matchmakingrequestendpoint';
  private urlN: string = 'http://localhost:3000/notifymatchendpoint';
  private currentGamer: PublicUser;

  // private currentMatchSubject: BehaviorSubject<MatchMakingRequest>;
  // public currentMatch: Observable<MatchMakingRequest>;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService
  ) {
    // this.currentMatchSubject = new BehaviorSubject<MatchMakingRequest>(null);
    // this.currentMatch = this.currentMatchSubject.asObservable();
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  searchMatch(gameData, filterData): Observable<any> {
    let sessionId = this.cookieService.get('gamer');
    let requestMatch = new MatchMakingRequest(
      sessionId,
      this.currentGamer.user_id,
      //first game_id of string array as num
      +gameData.game.value[1],
      filterData.playerParty.value,
      filterData.playerSearch.value,
      // String to bool
      filterData.playstyle.value == "true" ? true : false
    );
    console.log(requestMatch);
    return this.http.post<any>(this.urlS, requestMatch);
  }

  notifyMatch(request_id): Observable<any> {
    let notifyMatch = new NotifyMatch(request_id);
    return this.http.post<any>(this.urlN, notifyMatch);
  }

}
