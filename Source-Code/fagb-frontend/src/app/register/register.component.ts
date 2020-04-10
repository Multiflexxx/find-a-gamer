import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';

// Import Validator
import { emailValidator } from '../_shared/email-validator.directive';
import { compareValidator } from '../_shared/compare-validator.directive';
import { gameValidator } from '../_shared/game-validator.directive';

import { AuthenticationService, RegisterService, RegionService, LanguageService, GameService } from '../_services';
import { ToastrService } from 'ngx-toastr';
import { Region } from '../data_objects/region';
import { Language } from '../data_objects/language';
import { ControlsMap } from '../_interface/controls-map';

import { GameSelectStatus } from '../_classes/game-select-status';
import { MatStepper } from '@angular/material/stepper';

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
  public isEditable: boolean = false;
  public hideP: boolean = true;
  public hidePv: boolean = true;

  // ReactiveForms
  public profileForm: FormGroup;
  public gameForm: FormGroup;

  public profileData: ControlsMap<AbstractControl>;
  public gameData: ControlsMap<AbstractControl>;

  // Datepicker values
  public startDate: Date = new Date(2000, 0, 1);
  public minDate: Date;
  public maxDate: Date;

  // RegExp
  public regDisTag: string = '[a-zA-Z0-9]{2,32}#[0-9]{4}';
  public strongRegex: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  public mediumRegex: RegExp = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');


  // Backend input
  public regionList: Array<Region> = [];
  public langList: Array<Language> = [];

  @ViewChild('stepper') private stepper: MatStepper;

  public constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private authenticationService: AuthenticationService,
    private regionService: RegionService,
    private languageService: LanguageService,
    private gameService: GameService,
    private toastrService: ToastrService,) {

    // Set the minimum to January 1st 20 years in the past and December 31st a year in the future.
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 100, 0, 1);
    this.maxDate = new Date(currentYear - 6, 11, 31);
  }

  public ngOnInit(): void {
    this.createForm();

    this.regionService.getRegions()
      .subscribe(r => this.regionList = r);

    this.languageService.getLanguage()
      .subscribe(l => this.langList = l);

    this.gameService.setCompState(GameSelectStatus.COMP_REGISTER);
  }

  public createForm(): void {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(32)]],
      tag: ['', [Validators.required, Validators.pattern(this.regDisTag)]],
      email: ['', [Validators.required, emailValidator()]],
      date: ['', Validators.required],
      region: ['', Validators.required],
      lang: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      vpassword: ['', [Validators.required, compareValidator('password')]]
    });

    this.gameForm = this.formBuilder.group({
      game: ['', [Validators.required, gameValidator()]]
    });
  }

  private get profileValue(): ControlsMap<AbstractControl> {
    return this.profileForm.controls;
  }

  private get gameValue(): ControlsMap<AbstractControl> {
    return this.gameForm.controls;
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.profileForm.controls[controlName].hasError(errorName);
  }

  public hidePw(event: any): void { // without type info @https://angular.io/guide/user-input
    this.hideP = !this.hideP;
    event.preventDefault();
  }

  public hidePwV(event: any): void { // without type info @https://angular.io/guide/user-input
    this.hidePv = !this.hidePv;
    event.preventDefault();
  }

  public isStrong(controlName: string): number {
    let strenght = -1;
    const pw = this.profileForm.controls[controlName].value;
    if (this.strongRegex.test(pw)) {
      strenght = 2;
    } else if (this.mediumRegex.test(pw)) {
      strenght = 1;
    } else if (pw !== '') {
      strenght = 0;
    }
    return strenght;
  }

  public onProfileSubmit(): void {
    this.profileData = this.profileValue;
    console.log(this.profileValue);
  }

  public onGameSubmit(): void {
    this.gameData = this.gameValue;
    console.log(this.gameData);
    this.onSubmit();
  }

  public onSubmit(): void {
    this.registerService.register(this.profileData, this.gameData).subscribe(
      (data) => {
        this.authenticationService.loginS().subscribe(
          (dataL) => {
            console.log(dataL);
            this.router.navigate(['/profile']);
          },
          (error) => {
            console.log(error.error.error);
            this.stepper.reset();
            this.toastrService.error(error.error.error, 'Registration failed');
          });
      },
      (error) => {
        console.log(error.error.error);
      }
    );
  }
}
