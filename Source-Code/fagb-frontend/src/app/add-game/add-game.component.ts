import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {

  items = [
    {
      id: 0,
      name: "Age of Empires 2",
      img: "assets\\img\\Age-of-Empires-2.jpg"
    },
    {
      id: 1,
      name: "Rocket League",
      img: "assets\\img\\Rocket-League.jpg"
    },
    {
      id: 2,
      name: "Apex Legends",
      img: "assets\\img\\Apex-Legends.jpg"
    },
    {
      id: 3,
      name: "Age of Empires 2",
      img: "assets\\img\\Age-of-Empires-2.jpg"
    },
    {
      id: 4,
      name: "Rocket League",
      img: "assets\\img\\Rocket-League.jpg"
    },
    {
      id: 5,
      name: "Apex Legends",
      img: "assets\\img\\Apex-Legends.jpg"
    },
    {
      id: 5,
      name: "Apex Legends",
      img: "assets\\img\\Apex-Legends.jpg"
    },
    {
      id: 5,
      name: "Apex Legends",
      img: "assets\\img\\Apex-Legends.jpg"
    },
    {
      id: 5,
      name: "Apex Legends",
      img: "assets\\img\\Apex-Legends.jpg"
    }
  ];

  public isSelected: Array<boolean> = [false, false, false];
  public selectedGames: Array<number> = [];
  public gamesString: String = "";



  constructor() { }

  addGame(id, name): void {
    id = id;
    this.isSelected[id] = !this.isSelected[id];
    this.gamesString += name + " ";
    this.createTag(id, name);
    // console.log(id);
    // console.log(this.isSelected[id]);
  }

  createTag(id, name): void {
    let index: number = this.selectedGames.indexOf(id);
    console.log(index);
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
  }

  ngOnInit(): void {
  }

}