import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Login } from '../data_objects/login'
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private url = 'http://localhost:3000/loginendpoint';

  private currentGamerSubject: BehaviorSubject<Login>;
  public currentGamer: Observable<Login>;

  constructor(private http: HttpClient) {
    this.currentGamerSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('currentGamer')));
    this.currentGamer = this.currentGamerSubject.asObservable();
  }

  public get currentGamerValue(): Login {
    return this.currentGamerSubject.value;
  }

  login(loginValue) {
    var login = new Login(null, loginValue.email.value, loginValue.password.value, loginValue.check.value);

    console.log(login);

    return this.http.post<Login>(this.url, login)
      .pipe(map(gamer => {
        localStorage.setItem('currentGamer', JSON.stringify(gamer))
        this.currentGamerSubject.next(gamer);
      }))
  }
}
