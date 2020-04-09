import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route } from '@angular/router';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  public constructor(private authenticationService: AuthenticationService, private router: Router, private cookieService: CookieService) { }

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

  public checkLogin(url: string): boolean {
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
        this.router.navigate([url]);
      },
      (error) => {
        this.router.navigate(['/login']);
        console.log(error.error.error);
      }
    );
    return false;
  }

}
