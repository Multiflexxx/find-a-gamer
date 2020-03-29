import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Login } from '../data_objects/login'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  url = 'http://localhost:3000/loginendpoint';

  constructor(private http: HttpClient) { }

  login(loginValue){
    var login = new Login(null, loginValue.email.value, loginValue.password.value, loginValue.check.value);

    console.log(login);

    return this.http.post(this.url, login);
  }
}
