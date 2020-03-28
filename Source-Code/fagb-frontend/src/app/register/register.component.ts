import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormGroupDirective, NgForm, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Import Validator
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
  regionList = [
    {
      id: 1,
      name: 'Africa'
    },
    {
      id: 2,
      name: 'Asia'
    },
    {
      id: 3,
      name: 'Europa'
    },
    {
      id: 4,
      name: 'North America'
    },
    {
      id: 5,
      name: 'South America'
    }
  ];

  langList = [
    {
      id: 1,
      name: 'English'
    },
    {
      id: 2,
      name: 'German'
    }
  ];

  constructor(private formBuilder: FormBuilder) {

    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 6, 11, 31);
  }

  ngOnInit(): void {
    this.createForm();
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
      game: ['', Validators.required]
    });
  }

  private get profileValue() {
    return this.profileForm;
  }

  private get gameValue() {
    return this.gameForm;
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
  }

  onGameSubmit() {
    this.gameData = this.gameValue
  }

  onSubmit(): void {

  }
}
