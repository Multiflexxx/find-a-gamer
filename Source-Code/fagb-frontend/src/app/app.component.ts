import { Component } from '@angular/core';

import { AuthenticationService } from './_services';
import { PublicUser } from './data_objects/publicuser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title: string = 'FAGB';
  public currentGamer: PublicUser;

  public constructor(private authenticationService: AuthenticationService) {
    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }
}
