import { Component, OnInit } from '@angular/core';

import { MatchService } from '../../_services';

import { PublicUser } from '../../data_objects/publicuser';

@Component({
  selector: 'app-match-success',
  templateUrl: './match-success.component.html',
  styleUrls: ['./match-success.component.scss']
})
export class MatchSuccessComponent implements OnInit {
  public matchUsers;
  public matchGame;

  public constructor(private matchService: MatchService) { }

  public ngOnInit(): void {
    localStorage.removeItem('matchRequest');
    this.matchService.currentMatchUsers.subscribe(matchUsers => this.matchUsers = matchUsers);
    this.matchService.currentMatchGame.subscribe(matchGame => this.matchGame = matchGame);
  }

}
