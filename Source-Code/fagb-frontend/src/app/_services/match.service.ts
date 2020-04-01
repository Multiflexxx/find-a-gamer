import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private authenticationService: AuthenticationService
    ) { 
      this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
    }

  searchMatch(gameData, filterData): Observable<any> {
    let sessionId = this.cookieService.get('gamer');
    let request = new MatchMakingRequest(
      sessionId,
      this.currentGamer.user_id,
      gameData.game.value,
      filterData.playerParty.value,
      filterData.playerSearch.value,
      filterData.playstyle
    );
    
    return this.http.get<any>(this.url, );
  }
    
}
