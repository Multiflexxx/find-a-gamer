import { Component } from '@angular/core';

import { AuthenticationService } from './_services';
import { Login } from './data_objects/login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'FAGB';
  currentGamer: Login;

  constructor(
    private authenticationService : AuthenticationService
  ) {
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

}
