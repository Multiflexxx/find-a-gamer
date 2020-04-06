import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GameService } from '../_services';
import { GameResponse } from '../data_objects/gameresponse';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {
  @Input() gameForm: FormGroup;

  public gameList: Array<GameResponse> = [];
  public searchedGameList: Array<GameResponse> = [];

  private searchTerm: string = "";

  public isSelected: Array<boolean> = [];
  public selectedGames: Array<number> = [];
  public selectedGamesString: String;


  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getGame()
      .subscribe(g => this.gameList = g);
    
    this.gameService.getGame()
      .subscribe(g => this.searchedGameList = g);
  }

  onKey(event: any) { // without type info @https://angular.io/guide/user-input
    this.searchTerm = event.target.value;
    this.searchedGameList = this.searchGame(this.searchTerm);
  }

  searchGame(searchString: string) {
    return this.gameList.filter(g =>
      g.game.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  addGame(id: number, name: string): void {
    // id = id;
    this.isSelected[id] = !this.isSelected[id];
    this.createTag(id, name);
  }

  createTag(id: number, name: string): void {
    let index: number = this.selectedGames.indexOf(id);
    if (index == -1) {
      // Add game id to array
      this.selectedGames.push(id);

      // Create tag-component
      let control: HTMLElement = document.createElement("DIV");
      control.classList.add("control");
      control.id = "gametag" + id;

      let tags: HTMLElement = document.createElement("DIV");
      tags.classList.add("tags", "are-small", "has-addons");

      let span: HTMLElement = document.createElement("SPAN");
      span.classList.add("tag", "is-link");
      let text: Text = document.createTextNode(name);

      let adelete: HTMLElement = document.createElement("A");
      adelete.classList.add("tag", "is-delete");
      adelete.addEventListener("click", (e: Event) => this.addGame(id, name))

      span.appendChild(text);
      tags.appendChild(span);
      tags.appendChild(adelete);
      control.appendChild(tags);

      document.getElementById("gametags").appendChild(control);

      if (this.selectedGames.length == 1) {
        document.getElementById("gametag").style.display = "none";
      }
    } else {
      // Remove game id from array
      this.selectedGames.splice(index, 1);
      document.getElementById("gametag" + id).remove();
      if (this.selectedGames.length == 0) {
        document.getElementById("gametag").style.display = "inherit";
      }
    }
    this.selectedGamesString = JSON.stringify(this.selectedGames);
    this.gameForm.get('game').setValue(this.selectedGamesString);
  }
}