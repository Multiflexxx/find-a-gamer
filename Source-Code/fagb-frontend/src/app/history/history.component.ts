import { Component, OnInit } from '@angular/core';
import { MatchService } from '../_services/match.service';
import { MatchStatus } from '../_classes/match-status';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  public constructor(
    private matchService: MatchService,
  ) { }

  public ngOnInit(): void {
    this.matchService.setCompState(MatchStatus.COMP_HISTORY);
    this.matchService.getMatchHistory().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.log(error.error.error);
      }
    );
  }

}
