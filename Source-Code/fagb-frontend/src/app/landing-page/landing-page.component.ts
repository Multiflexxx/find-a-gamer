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

  // items = [
  //   {
  //     id: 0,
  //     name: 'Age of Empires 2',
  //     img: 'assets\\img\\Age-of-Empires-2.jpg'
  //   },
  //   {
  //     id: 1,
  //     name: 'Rocket League',
  //     img: 'assets\\img\\Rocket-League.jpg'
  //   },
  //   {
  //     id: 2,
  //     name: 'Apex Legends',
  //     img: 'assets\\img\\Apex-Legends.jpg'
  //   },
  //   {
  //     id: 3,
  //     name: 'Age of Empires 2',
  //     img: 'assets\\img\\Age-of-Empires-2.jpg'
  //   },
  //   {
  //     id: 4,
  //     name: 'Rocket League',
  //     img: 'assets\\img\\Rocket-League.jpg'
  //   },
  //   {
  //     id: 5,
  //     name: 'Apex Legends',
  //     img: 'assets\\img\\Apex-Legends.jpg'
  //   },
  //   {
  //     id: 5,
  //     name: 'Apex Legends',
  //     img: 'assets\\img\\Apex-Legends.jpg'
  //   },
  //   {
  //     id: 5,
  //     name: 'Apex Legends',
  //     img: 'assets\\img\\Apex-Legends.jpg'
  //   },
  //   {
  //     id: 5,
  //     name: 'Apex Legends',
  //     img: 'assets\\img\\Apex-Legends.jpg'
  //   }
  // ];

  public constructor(private gameService: GameService) { }

  public ngOnInit(): void {
    this.gameService.getGame()
      .subscribe(g => this.gameList = g);
  }
}
