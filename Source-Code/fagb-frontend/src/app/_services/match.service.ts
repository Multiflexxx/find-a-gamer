import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';

import { MatchMakingRequest } from '../data_objects/matchmakingrequest';
import { PublicUser } from '../data_objects/publicuser';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private url: string = 'http://localhost:3000/matchmakingrequestendpoint';
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
    return this.http.post<any>(this.url, requestMatch);
  }

}
