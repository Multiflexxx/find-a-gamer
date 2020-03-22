import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Import data objects
import { Registration } from '../data_objects/registration';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // stepper
  isEditable = false;
  hide = true;
  profileForm: FormGroup;
  gameForm: FormGroup;

  private profileData: any;
  private gameData: any;
  url = 'http://httpbin.org/post';
  // url = 'http://localhost:3000/registrationendpoint';
  json;

  // RegExp
  regDisTag : string = '[a-zA-Z0-9]{2,32}#[0-9]{4}';

  regionList = [
    {
      id: 0,
      name: 'Africa'
    },
    {
      id: 1,
      name: 'Asia'
    },
    {
      id: 2,
      name: 'North America'
    },
    {
      id: 3,
      name: 'South America'
    },
    {
      id: 4,
      name: 'Africa'
    }
  ];

  langList = [
    {
      id: 0,
      name: 'english'
    },
    {
      id: 1,
      name: 'german'
    }
  ];

  constructor(private http: HttpClient) {
    this.profileForm = new FormGroup({
      nameCtrl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]),
      tagCtrl: new FormControl('', [Validators.required, Validators.pattern(this.regDisTag)]),
      mailCtrl: new FormControl('', [Validators.required, Validators.email]),
      dateCtrl: new FormControl('', Validators.required),
      regionCtrl: new FormControl('', Validators.required),
      langCtrl: new FormControl('', Validators.required),
      passCtrl: new FormControl('', Validators.required),
      rpassCtrl: new FormControl('', Validators.required)
    });

    this.gameForm = new FormGroup({
      gameCtrl: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }

  public hasError = (controlName: string, errorName: string) =>{
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  onProfileSubmit(userData): void {
    this.profileData = userData;
  }

  onGameSubmit(userData): void {
    this.gameData = userData;
    console.log(this.profileData);
    this.onSubmit();
  }

  onSubmit(): void {
    var games: Array<Game> = [];
    var gameids: Array<number> = JSON.parse(this.gameData.gameCtrl);
    for (let i = 0; i < gameids.length; i++) {
      games.push(new Game(gameids[i]));
    }


    // Langs with id!!!!
    var langs: Array<Language> = [];
    for (let i = 0; i < this.profileData.langCtrl.length; i++) {
      langs.push(new Language(this.profileData.langCtrl[i]));
    }

    var region: Region = this.profileData.regionCtrl;

    var registration: Registration = new Registration(
      this.profileData.mailCtrl,
      this.profileData.passCtrl,
      this.profileData.nameCtrl,
      this.profileData.tagCtrl,
      this.profileData.dateCtrl,
      region,
      langs,
      games
    );

    console.log(registration);

    this.http.post(this.url, registration).toPromise().then((data: any) => {
      console.log(data);
      this.json = JSON.stringify(data.json);
    });
  }
}
