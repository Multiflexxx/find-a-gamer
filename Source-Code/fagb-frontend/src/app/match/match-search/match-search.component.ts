import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { gameValidator } from 'src/app/shared/game-validator.directive';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { MatchService } from '../../_services'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-match-search',
  templateUrl: './match-search.component.html',
  styleUrls: ['./match-search.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class MatchSearchComponent implements OnInit {
  // Stepper values
  isEditable = false;


  // ReactiveForms
  gameForm: FormGroup;
  matchFilterForm: FormGroup;

  gameData;
  filterData;

  // Backend input
  playerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  playstyleList = [
    {
      name: 'Casual',
      value: 'true'
    },
    {
      name: 'Ranked',
      value: 'false'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matchService: MatchService,
    
  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.gameForm = this.formBuilder.group({
      game: ['', [Validators.required, gameValidator()]]
    });

    this.matchFilterForm = this.formBuilder.group({
      playerParty: ['', Validators.required],
      playerSearch: ['', Validators.required],
      playstyle: ['', Validators.required]
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.matchFilterForm.controls[controlName].hasError(errorName);
  }

  private get gameValue() {
    return this.gameForm.controls;
  }

  private get filterValue() {
    return this.matchFilterForm.controls;
  }

  onMatchGameSubmit() {
    this.gameData = this.gameValue;
    console.log(this.gameData);
  }

  onMatchFilterSubmit() {
    this.filterData = this.filterValue;
    console.log(this.filterData);
    this.onSubmit();
  }

  onSubmit(): void {
    this.matchService.searchMatch(this.gameData, this.filterData).subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('matchRequest', JSON.stringify(data));
        this.router.navigate(['/match-process']);
      },
      (error) => {
        console.log("Nein!");
        console.log(error.error.error);
      }
    )
  }
}
