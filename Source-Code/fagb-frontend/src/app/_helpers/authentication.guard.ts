import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route } from '@angular/router';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';
import { Login } from '../data_objects/login';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService, private router: Router, private cookieService: CookieService) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    
    console.log(url);
    if (url == 'login') {
      return !this.checkLogin(url);
    }

    return this.checkLogin(url);
  }

  canActivateChild(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(next, state);
  }

  canLoad(route: Route): boolean {
    let url = '/${route.path}'

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (this.authenticationService.isLoggedIn) {
      return true;
    }

    this.authenticationService.redirectUrl = url;
    let sessionId = this.cookieService.get('gamer');

    if (sessionId == "" || null) {
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
    )
    return false;
  }

}
