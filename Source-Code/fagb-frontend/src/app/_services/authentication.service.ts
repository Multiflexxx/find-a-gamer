import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { Login } from '../data_objects/login';
import { PublicUser } from '../data_objects/publicuser';
import { LoginResponse } from '../data_objects/loginresponse';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public get currentGamerValue(): PublicUser {
    return this.currentGamerSubject.value;
  }
  public isLoggedIn: boolean = false;
  public redirectUrl: string;
  public currentGamer: Observable<PublicUser>;
  private url: string = 'http://localhost:3000/loginendpoint';

  private currentGamerSubject: BehaviorSubject<PublicUser>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentGamerSubject = new BehaviorSubject<PublicUser>(null);
    this.currentGamer = this.currentGamerSubject.asObservable();
  }

  login(loginValue): Observable<LoginResponse> {
    console.log(loginValue);
    const login: Login = new Login(null, loginValue.email.value, loginValue.password.value, loginValue.check.value);
    return this.http.post<LoginResponse>(this.url, login)
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
      }));
  }

  loginS(): Observable<LoginResponse> {
    const sessionId: string = this.cookieService.get('gamer');
    const loginS: Login = new Login(sessionId);

    return this.http.post<LoginResponse>(this.url, loginS)
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
        return data;
      }));
  }

  logout(): void {
    this.cookieService.delete('gamer');
    this.isLoggedIn = false;
    this.currentGamerSubject.next(null);
  }
}
