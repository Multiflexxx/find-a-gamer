import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route } from '@angular/router';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';
import { MatchMakingResponse } from '../data_objects/matchmakingresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  public constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private cookieService: CookieService
  ) { }

  public canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;

    if (url === 'login') {
      return !this.checkLogin(url);
    }

    return this.checkLogin(url);
  }

  public canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  public canLoad(route: Route): boolean {
    const url = '/${route.path}';

    return this.checkLogin(url);
  }

  private checkLogin(url: string): boolean {
    if (this.authenticationService.isLoggedIn) {
      return true;
    }

    this.authenticationService.redirectUrl = url;
    const sessionId = this.cookieService.get('gamer');

    if (sessionId === '' || null) {
      this.router.navigate(['/login']);
      return false;
    }

    this.authenticationService.loginS().subscribe(
      (data) => {
        if (url === '/match' || url === '/match-process' || url === '/match-success') {
          this.checkRequest();
        } else {
          this.router.navigate([url]);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
        console.log(error.error.error);
      }
    );
    return false;
  }

  private checkRequest(): void {
    const matchData: MatchMakingResponse = JSON.parse(localStorage.getItem('matchMakingResponse'));
    if (matchData !== null && matchData.matchmaking_request.user_id === this.authenticationService.currentGamerValue.user_id) {
      if (!!matchData.users) {
        this.router.navigate(['match-success']);
      } else {
        this.router.navigate(['match-process']);
      }
    } else {
      this.router.navigate(['match']);
    }
  }
}
