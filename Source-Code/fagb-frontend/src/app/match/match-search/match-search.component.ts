import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { gameValidator } from 'src/app/_shared/game-validator.directive';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import { MatchService, GameService } from '../../_services';
import { ToastrService } from 'ngx-toastr';
import { ControlsMap } from 'src/app/_interface/controls-map';

import { GameSelectStatus } from '../../_classes/game-select-status';

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
  public isEditable: boolean = false;


  // ReactiveForms
  public gameForm: FormGroup;
  public matchFilterForm: FormGroup;

  public gameData: ControlsMap<AbstractControl>;
  public filterData: ControlsMap<AbstractControl>;

  // Backend input
  public playerList: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  public playstyleList = [
    {
      name: 'Casual',
      value: 'true'
    },
    {
      name: 'Ranked',
      value: 'false'
    }
  ];

  public constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private matchService: MatchService,
    private gameService: GameService,
    private toastrService: ToastrService,
  ) { }

  public ngOnInit(): void {
    this.createForm();

    this.gameService.setCompState(GameSelectStatus.COMP_MATCH);
    this.gameService.setFormState(GameSelectStatus.FORM_MATCH);
  }

  public createForm(): void {
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

  private get gameValue(): ControlsMap<AbstractControl> {
    return this.gameForm.controls;
  }

  private get filterValue(): ControlsMap<AbstractControl> {
    return this.matchFilterForm.controls;
  }

  public onMatchGameSubmit(): void {
    this.gameData = this.gameValue;
    console.log(this.gameData);
  }

  public onMatchFilterSubmit(): void {
    this.filterData = this.filterValue;
    console.log(this.filterData);
    this.onSubmit();
  }

  public onSubmit(): void {
    this.matchService.searchMatch(this.gameData, this.filterData).subscribe(
      (data) => {
        console.log(data);
        localStorage.setItem('matchMakingResponse', JSON.stringify(data));
        this.router.navigate(['/match-process']);
      },
      (error) => {
        console.log(error.error.error);
        this.toastrService.error(error.error.error, 'Matchmaking failed');
        this.router.navigate(['/match-process']);
      }
    );
  }
}
