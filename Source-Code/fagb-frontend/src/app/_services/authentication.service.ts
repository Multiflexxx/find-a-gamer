import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Login } from '../data_objects/login'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url: string = 'http://localhost:3000/loginendpoint';

  private currentGamerSubject: BehaviorSubject<Login>;
  public currentGamer: Observable<Login>;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.currentGamerSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('currentGamer')));
    this.currentGamer = this.currentGamerSubject.asObservable();
  }

  public get currentGamerValue(): Login {
    return this.currentGamerSubject.value;
  }

  login(loginValue) {
    var login = new Login(null, loginValue.email.value, loginValue.password.value, loginValue.check.value);

    return this.http.post<any>(this.url, login)
      .pipe(map(gamer => {
        if (gamer && gamer.successful) {
          let expiration: Date = null;
          if (gamer.session.expiration_date != null) {
            expiration = new Date(gamer.session.expiration_date);
          }
          this.cookieService.set('gamer', gamer.session.session_id, expiration);
          this.currentGamerSubject.next(gamer); 
        }

        return gamer;
      }))
  }
}
