import { Component, OnInit } from '@angular/core';

import { AuthenticationService, RegionService, LanguageService } from '../../_services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile-update',
  templateUrl: './profile-update.component.html',
  styleUrls: ['./profile-update.component.scss']
})
export class ProfileUpdateComponent implements OnInit {

  profileUpdateForm: FormGroup;

  public gamer;
  public lang: string;

  regionList = [];
  regionSelected: string;
  langList = [];
  languageSelected: string[] = [];


  constructor(
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private regionService: RegionService,
    private languageService: LanguageService) { }


  ngOnInit(): void {
    this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
    this.lang = this.getLanguages(this.gamer.languages);
    this.regionSelected = this.gamer.region.region_id;
    this.languageSelected = this.getSelectedLanguages(this.gamer.languages);

    this.createForm();

    this.regionService.getRegions()
      .subscribe(r => this.regionList = r);

    this.languageService.getLanguage()
      .subscribe(l => this.langList = l);

  }

  getLanguages(arr): string {
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

  getSelectedLanguages(arr): string[] {
    for (let i = 0; i < arr.length; i++) {
      this.languageSelected[i] = arr[i].language_id;

    }
    console.log(this.languageSelected);
    return this.languageSelected;
  }

  createForm() {
    this.profileUpdateForm = this.formBuilder.group({
      cakeday: ['', [Validators.required]],
      region: ['', [Validators.required]],
      lang: ['', [Validators.required]],
      bio: ['', [Validators.required], [Validators.maxLength(100)]],
    });
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.profileUpdateForm.controls[controlName].hasError(errorName);
  }

}
