import { Component, OnInit } from '@angular/core';

import { AuthenticationService, RegionService, LanguageService, ProfileService } from '../../_services';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { PublicUser } from 'src/app/data_objects/publicuser';
import { Language } from 'src/app/data_objects/language';
import { Region } from 'src/app/data_objects/region';
import { ControlsMap } from 'src/app/interface/controls-map';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {
  public profileUpdateForm: FormGroup;

  public gamer: PublicUser;
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
    private languageService: LanguageService) { }


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
  }

  public createForm(): void {
    this.profileUpdateForm = this.formBuilder.group({
      region: [this.regionSelected, Validators.required],
      lang: [this.languageSelected, Validators.required],
      oPassword: ['', Validators.required],
      nPassword: ['', Validators.required],
      biography: [this.gamer.biography, [Validators.required, Validators.maxLength(100)]],
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.profileUpdateForm.controls[controlName].hasError(errorName);
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
    this.profileService.updateProfile(this.profileUpdateValue);
  }
}
