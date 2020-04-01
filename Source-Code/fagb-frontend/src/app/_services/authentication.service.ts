import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';

import { Login } from '../data_objects/login'
import { PublicUser } from '../data_objects/publicuser'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url: string = 'http://localhost:3000/loginendpoint';
  isLoggedIn = false;
  redirectUrl: string;

  private currentGamerSubject: BehaviorSubject<PublicUser>;
  public currentGamer: Observable<PublicUser>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentGamerSubject = new BehaviorSubject<PublicUser>(null);
    this.currentGamer = this.currentGamerSubject.asObservable();
  }

  public get currentGamerValue(): PublicUser {
    return this.currentGamerSubject.value;
  }

  login(loginValue) {
    console.log(loginValue);
    let login = new Login(null, loginValue.email.value, loginValue.password.value, loginValue.check.value);
    console.log(login);
    return this.http.post<any>(this.url, login)
      .pipe(map(data => {
        if (data && data.successful) {
          let expiration: Date = null;
          if (data.session.expiration_date != null) {
            expiration = new Date(data.session.expiration_date);
          }
          this.isLoggedIn = true;
          this.cookieService.set('gamer', data.session.session_id, expiration);
          this.currentGamerSubject.next(
            new PublicUser(
              data.user.user_id, 
              data.user.nickname, 
              data.user.discord_tag, 
              data.user.cake_day, 
              data.user.region, 
              data.user.games,
              data.user.languages)
          );
        }
        return data;
      }))
  }

  loginS() {
    let sessionId = this.cookieService.get('gamer');
    let loginS: Login = new Login(sessionId);

    return this.http.post<any>(this.url, loginS)
      .pipe(map(data => {
        if (data && data.successful) {
          this.isLoggedIn = true;
          this.currentGamerSubject.next(
            new PublicUser(
              data.user.user_id, 
              data.user.nickname, 
              data.user.discord_tag, 
              data.user.cake_day, 
              data.user.region, 
              data.user.games,
              data.user.languages)
          );
        }
        console.log(data);
        console.log(this.currentGamerValue);
        return data;
      }))
  }

  logout(): void {
    this.cookieService.delete('gamer');
    this.isLoggedIn = false;
    this.currentGamerSubject.next(null);
  }
}
