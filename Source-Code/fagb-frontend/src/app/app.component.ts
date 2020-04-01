import { Component } from '@angular/core';

import { AuthenticationService } from './_services';
import { Login } from './data_objects/login';
import { PublicUser } from './data_objects/publicuser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  
  title = 'FAGB';
  currentGamer: PublicUser;

  constructor(
    private authenticationService : AuthenticationService
  ) {
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }
}
