import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../_services';
import { PublicUser } from 'src/app/data_objects/publicuser';
import { Language } from 'src/app/data_objects/language';

@Component({
  selector: 'app-profile-overview',
  templateUrl: './profile-overview.component.html',
  styleUrls: ['./profile-overview.component.scss']
})
export class ProfileOverviewComponent implements OnInit {
  public gamer: PublicUser;
  public lang: string;
  public constructor(private authenticationService: AuthenticationService) { }


  public ngOnInit(): void {
    this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
    this.lang = this.getLanguages(this.gamer.languages);
  }

  public getLanguages(arr: Language[]): string {
    let langString: string = '';
    for (let i = 0; i < arr.length; i++) {
      langString += arr[i].name;
      if (i < arr.length - 1) {
        langString += ', ';
      }
    }
    console.log(langString);
    return langString;
  }

}
