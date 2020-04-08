import { Component, OnInit } from '@angular/core';

import { MatchService } from '../../_services';

import { PublicUser } from '../../data_objects/publicuser';
import { Game } from 'src/app/data_objects/game';

@Component({
  selector: 'app-match-success',
  templateUrl: './match-success.component.html',
  styleUrls: ['./match-success.component.scss']
})
export class MatchSuccessComponent implements OnInit {
  public matchUsers: Array<PublicUser>;
  public matchGame: Game;

  public constructor(private matchService: MatchService) { }

  public ngOnInit(): void {
    localStorage.removeItem('matchRequest');
    this.matchService.currentMatchUsers.subscribe(matchUsers => this.matchUsers = matchUsers);
    this.matchService.currentMatchGame.subscribe(matchGame => this.matchGame = matchGame);
  }

}
