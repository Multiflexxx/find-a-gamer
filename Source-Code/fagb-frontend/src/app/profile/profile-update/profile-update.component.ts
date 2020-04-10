import { Component, OnInit } from '@angular/core';

import { AuthenticationService, RegionService, LanguageService, ProfileService, GameService } from '../../_services';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PublicUser } from 'src/app/data_objects/publicuser';
import { Language } from 'src/app/data_objects/language';
import { Region } from 'src/app/data_objects/region';
import { ControlsMap } from 'src/app/_interface/controls-map';
import { Router } from '@angular/router';

import { GameSelectStatus } from '../../_classes/game-select-status';
import { gameValidator } from 'src/app/_shared/game-validator.directive';
import { AddGameComponent } from 'src/app/add-game/add-game.component';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {
  // RegExp
  public strongRegex: RegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})');
  public mediumRegex: RegExp = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})');

  public profileUpdateForm: FormGroup;
  public gamer: PublicUser;
  public loading: boolean = false;
  public hidePo: boolean = true;
  public hidePn: boolean = true;
  public lang: string;

  public regionList: Array<Region> = [];
  public langList: Array<Language> = [];
  private regionSelected: number;
  private languageSelected: Array<number> = [];


  public constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService,
    private regionService: RegionService,
    private languageService: LanguageService,
    private gameService: GameService,
    private router: Router) { }


  public ngOnInit(): void {
    this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
    this.lang = this.getLanguages(this.gamer.languages);
    this.regionSelected = this.gamer.region.region_id;
    this.languageSelected = this.getSelectedLanguages(this.gamer.languages);

    this.regionService.getRegions()
      .subscribe(r => this.regionList = r);

    this.languageService.getLanguage()
      .subscribe(l => this.langList = l);

    this.createForm();

    this.gameService.setCompState(GameSelectStatus.COMP_PROFILE);
    this.gameService.setFormState(GameSelectStatus.FORM_PROFILE);
  }

  public createForm(): void {
    this.profileUpdateForm = this.formBuilder.group({
      region: [this.regionSelected],
      lang: [this.languageSelected],
      oPassword: [''],
      nPassword: ['', Validators.minLength(6)],
      biography: [this.gamer.biography, Validators.maxLength(100)],
      game: ['', gameValidator()],
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.profileUpdateForm.controls[controlName].hasError(errorName);
  }

  public hidePwO(event: any): void { // without type info @https://angular.io/guide/user-input
    this.hidePo = !this.hidePo;
    event.preventDefault();
  }

  public hidePwN(event: any): void { // without type info @https://angular.io/guide/user-input
    this.hidePn = !this.hidePn;
    event.preventDefault();
  }

  public isStrong(controlName: string): number {
    let strenght = -1;
    const pw = this.profileUpdateForm.controls[controlName].value;
    if (this.strongRegex.test(pw)) {
      strenght = 2;
    } else if (this.mediumRegex.test(pw)) {
      strenght = 1;
    } else if (pw !== '') {
      strenght = 0;
    }
    return strenght;
  }

  public getLanguages(arr: Language[]): string {
    let langString: string = '';
    for (let i = 0; i < arr.length; i++) {
      langString += arr[i].name;
      if (i < arr.length - 1) {
        langString += ', ';
      }
    }
    return langString;
  }

  public getSelectedLanguages(arr: Array<Language>): Array<number> {
    for (let i = 0; i < arr.length; i++) {
      this.languageSelected[i] = arr[i].language_id;

    }
    return this.languageSelected;
  }

  private get profileUpdateValue(): ControlsMap<AbstractControl> {
    return this.profileUpdateForm.controls;
  }

  public onProfileUpdateSubmit(): void {
    this.loading = true;
    this.profileService.updateProfile(this.profileUpdateValue).subscribe(
      (data) => {
        console.log(data);
        this.router.navigate(['/profile']);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.log(error.error.error);
      }
    );
  }
}
