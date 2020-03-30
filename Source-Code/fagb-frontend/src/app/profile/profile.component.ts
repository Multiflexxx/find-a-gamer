import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public gamer;
  constructor(private authenticationService: AuthenticationService) { }


  ngOnInit(): void {
    this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
  }

}
