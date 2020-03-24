import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Import data objects
import { Registration } from '../data_objects/registration';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';
import { emailValidator } from '../shared/email-validator.directive';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { compareValidator } from '../shared/compare-validator.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class RegisterComponent implements OnInit {
  // Stepper values
  isEditable = false;
  hide = true;

  // ReactiveForms
  profileForm: FormGroup;
  gameForm: FormGroup;

  // Datepicker values
  public startDate = new Date(2000, 0, 1);
  public minDate: Date;
  public maxDate: Date;

  private profileData: any;
  private gameData: any;

  // RegExp
  regDisTag: string = '[a-zA-Z0-9]{2,32}#[0-9]{4}';
  strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


  //url = 'http://httpbin.org/post';
  url = 'http://localhost:3000/registrationendpoint';
  json;

  // Backend input
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
      name: 'Europa'
    },
    {
      id: 3,
      name: 'North America'
    },
    {
      id: 4,
      name: 'South America'
    }
  ];

  langList = [
    {
      id: 0,
      name: 'English'
    },
    {
      id: 1,
      name: 'German'
    }
  ];

  constructor(private formBuilder: FormBuilder ,private http: HttpClient) {
    
    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 6, 11, 31);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.profileForm = new FormGroup({
      nameCtrl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]),
      tagCtrl: new FormControl('', [Validators.required, Validators.pattern(this.regDisTag)]),
      mailCtrl: new FormControl('', [Validators.required, emailValidator()]),
      dateCtrl: new FormControl('', Validators.required),
      regionCtrl: new FormControl('', Validators.required),
      langCtrl: new FormControl('', Validators.required),
      passCtrl: new FormControl('', Validators.required),
      rpassCtrl: new FormControl('', [Validators.required, compareValidator('passCtrl')]),
    });

    this.gameForm = new FormGroup({
      gameCtrl: new FormControl('', Validators.required)
    });
  }

  // get nameCtrl() {
  //   return this.profileForm.get('nameCtrl');
  // }

  // get tagCtrl() {
  //   return this.profileForm.get('tagCtrl');
  // }

  // get mailCtrl() {
  //   return this.profileForm.get('mailCtrl');
  // }

  // get dateCtrl() {
  //   return this.profileForm.get('dateCtrl');
  // }

  // get regionCtrl() {
  //   return this.profileForm.get('regionCtrl');
  // }

  // get langCtrl() {
  //   return this.profileForm.get('langCtrl');
  // }

  // get passCtrl() {
  //   return this.profileForm.get('passCtrl');
  // }

  // get pwConfirm() {
  //   return this.profileForm.get('rpassCtrl');
  // }


  public hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  public isStrong(controlName: string): number {
    let strenght = -1;
    let pw = this.profileForm.controls[controlName].value;
    if (this.mediumRegex.test(pw)) {
      strenght = 1;
      console.log(controlName);
    } else if (this.strongRegex.test(pw)) {
      strenght = 2;
    } else if (pw != "") {
      strenght = 0;
    }
    return strenght;
  }

  onProfileSubmit(userData): void {
    this.profileData = userData;
    console.log(this.profileData);
  }

  onGameSubmit(userData): void {
    this.gameData = userData;
    console.log(this.gameData);
    this.onSubmit();
  }

  onSubmit(): void {
    var games: Array<Game> = [];
    var gameids: Array<number> = JSON.parse(this.gameData.gameCtrl);
    for (let i = 0; i < gameids.length; i++) {
      games.push(new Game(gameids[i]));
    }

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

    registration.birthdate.toJSON;
    console.log(registration);
    console.log(JSON.stringify(registration));


    this.http.post(this.url, registration).toPromise().then((data: any) => {
      console.log(data);
      this.json = JSON.stringify(data.json);
    });
  }
}
