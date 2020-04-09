import { Component, OnInit } from '@angular/core';

import { GameService } from '../_services';
import { GameResponse } from '../data_objects/gameresponse';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public gameList: Array<GameResponse> = [];

  public constructor(private gameService: GameService) { }

  public ngOnInit(): void {
    this.gameService.getGame()
      .subscribe(g => this.gameList = g);
  }
}
