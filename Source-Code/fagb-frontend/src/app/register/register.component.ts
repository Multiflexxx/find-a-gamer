import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

// Import Validator
import { emailValidator } from '../shared/email-validator.directive';
import { compareValidator } from '../shared/compare-validator.directive';
import { gameValidator } from '../shared/game-validator.directive';

import { RegisterService, RegionService, LanguageService } from '../_services';
import { AuthenticationService } from '../_services/authentication.service';

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

  profileData;
  gameData;

  // Datepicker values
  public startDate = new Date(2000, 0, 1);
  public minDate: Date;
  public maxDate: Date;

  // RegExp
  regDisTag: string = '[a-zA-Z0-9]{2,32}#[0-9]{4}';
  strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");


  // Backend input
  regionList = [];
  langList = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private authenticationService: AuthenticationService,
    private regionService: RegionService,
    private languageService: LanguageService) {

    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 6, 11, 31);
  }

  ngOnInit(): void {
    this.createForm();

    this.regionService.getRegions()
      .subscribe(r => this.regionList = r);

      this.languageService.getLanguage()
      .subscribe(l => this.langList = l);
  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      tag: ['', [Validators.required, Validators.pattern(this.regDisTag)]],
      email: ['', [Validators.required, emailValidator()]],
      date: ['', Validators.required],
      region: ['', Validators.required],
      lang: ['', Validators.required],
      password: ['', Validators.required],
      vpassword: ['', [Validators.required, compareValidator('password')]]
    });

    this.gameForm = this.formBuilder.group({
      game: ['', [Validators.required, gameValidator()]]
    });
  }

  private get profileValue() {
    return this.profileForm.controls;
  }

  private get gameValue() {
    return this.gameForm.controls;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  public isStrong(controlName: string): number {
    let strenght = -1;
    let pw = this.profileForm.controls[controlName].value;
    if (this.strongRegex.test(pw)) {
      strenght = 2;
    } else if (this.mediumRegex.test(pw)) {
      strenght = 1;
    } else if (pw != "") {
      strenght = 0;
    }
    return strenght;
  }

  onProfileSubmit() {
    this.profileData = this.profileValue
    console.log(this.profileValue);
  }

  onGameSubmit() {
    this.gameData = this.gameValue
    console.log(this.gameData);
    this.onSubmit();
  }



  onSubmit(): void {
    this.registerService.register(this.profileData, this.gameData).subscribe(
      (data)=>{
        console.log(data);
        console.log(data.session_id);
        this.authenticationService.loginS().subscribe(
          (data) => {
            console.log(data);
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.log(error.error.error);
          })
      },
      (error)=>{
        console.log("Shit");
      }
    )

  }
}
