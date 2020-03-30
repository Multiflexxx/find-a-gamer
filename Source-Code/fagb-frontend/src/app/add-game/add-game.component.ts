import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GameService } from '../_services';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {
  @Input() gameForm: FormGroup;

  gameList = [];
  searchedGameList = [];

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

  onKey(event: any) {
    this.searchTerm = event.target.value;
    this.searchedGameList = this.searchGame(this.searchTerm);
  }

  searchGame(searchString: string) {
    return this.gameList.filter(g =>
      g.game.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  addGame(id, name): void {
    // Array starts by index 0 
    id = id;
    this.isSelected[id] = !this.isSelected[id];
    this.createTag(id, name);
  }

  createTag(id, name): void {
    let index: number = this.selectedGames.indexOf(id);
    if (index == -1) {
      // Add game id to array
      this.selectedGames.push(id);

      // Create tag-component
      var control = document.createElement("DIV");
      control.classList.add("control");
      control.id = "gametag" + id;

      var tags = document.createElement("DIV");
      tags.classList.add("tags", "are-small", "has-addons");

      var span = document.createElement("SPAN");
      span.classList.add("tag", "is-link");
      var text = document.createTextNode(name);

      var adelete = document.createElement("A");
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