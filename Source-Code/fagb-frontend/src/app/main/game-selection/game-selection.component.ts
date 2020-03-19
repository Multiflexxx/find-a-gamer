import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-selection',
  templateUrl: './game-selection.component.html',
  styleUrls: ['./game-selection.component.scss']
})
export class GameSelectionComponent implements OnInit {

  // items = 
  // [
  //   {item: 1},{item: 1},{item: 1},
  //   {item: 1},{item: 1},{item: 1},
  //   {item: 1},{item: 1},{item: 1},
  //   {item: 1},{item: 1},{item: 1}

  // ]

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



  // public isSelected = false; 

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
      var span = document.createElement("SPAN");
      span.id = "gametag" +id;
      span.classList.add("tag");
      var text = document.createTextNode(name);
      span.appendChild(text);
      document.getElementById("gameTags").appendChild(span);
      if(this.selectedGames.length == 1) {
        document.getElementById("gametag").style.display = "none";
      }
    } else {
      // Remove game id from array
      this.selectedGames.splice(index,1);
      document.getElementById("gametag" + id).remove();
      if(this.selectedGames.length == 0) {
        document.getElementById("gametag").style.display = "inherit";
      }
    }


  }

  // <span class="tag">All</span>
  ngOnInit(): void {
  }

}
