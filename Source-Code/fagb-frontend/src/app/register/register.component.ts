import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroupDirective, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';

// Import data objects
import { Registration } from '../data_objects/registration';
import { Game } from '../data_objects/game';
import { Language } from '../data_objects/language';
import { Region } from '../data_objects/region';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  // stepper
  isEditable = false;
  hide = true;
  profileFormGroup: FormGroup;
  gameFormGroup: FormGroup;

  private profileData: any;
  private gameData: any;
  url = 'http://httpbin.org/post';
  // url = 'http://localhost:3000/registrationendpoint';
  json;

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

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    this.profileFormGroup = this.formBuilder.group({
      nameCtrl: ['', Validators.required],
      tagCtrl: ['', Validators.required],
      mailCtrl: ['', [Validators.required, Validators.email]],
      dateCtrl: ['', Validators.required],
      regionCtrl: ['', Validators.required],
      langCtrl: ['', Validators.required],
      passCtrl: ['', Validators.required],
      rpassCtrl: ['', Validators.required]
    });

    this.gameFormGroup = this.formBuilder.group({
      gameCtrl: ['', Validators.required]
    });
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

  ngOnInit(): void {
  }

}
