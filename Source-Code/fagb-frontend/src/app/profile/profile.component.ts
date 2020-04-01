import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../_services'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  
  // items = [
  //   {
  //     id: 0,
  //     name: "Age of Empires 2",
  //     img: "assets\\img\\Age-of-Empires-2.jpg"
  //   },
  //   {
  //     id: 1,
  //     name: "Rocket League",
  //     img: "assets\\img\\Rocket-League.jpg"
  //   },
  //   {
  //     id: 2,
  //     name: "Apex Legends",
  //     img: "assets\\img\\Apex-Legends.jpg"
  //   },
  //   {
  //     id: 3,
  //     name: "Age of Empires 2",
  //     img: "assets\\img\\Age-of-Empires-2.jpg"
  //   },
  //   {
  //     id: 4,
  //     name: "Rocket League",
  //     img: "assets\\img\\Rocket-League.jpg"
  //   },
  //   {
  //     id: 5,
  //     name: "Apex Legends",
  //     img: "assets\\img\\Apex-Legends.jpg"
  //   },
  // ];

  public gamer;
  public lang: string;
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
    this.lang = this.getLanguages(this.gamer.languages);
  }

  getLanguages(arr): string {
    let langString: string = "";
    for(let i=0; i<arr.length; i++) {
      langString += arr[i].name;
      if(i < arr.length - 1) {
        langString += ", "
      }
    }
    console.log(langString);
    return langString;
  }

}
