import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-gamesearch',
  templateUrl: './gamesearch.component.html',
  styleUrls: ['./gamesearch.component.scss']
})
export class GamesearchComponent implements OnInit {
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
  constructor() {
    
  
   }

  ngOnInit(): void {
    
  }

}
